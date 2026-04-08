import {useEffect, useState, useMemo, useRef} from "react";
// style

// API
import {API_getTaskTarget} from "../../../utils/API/API_Targets";

// components
import MarkDownTextComponent from "../../../components/MarkDownText/MarkDownText";

// interface
import {
  ITaskContentProps,
  ITaskSubTarget,
  ITaskTargetNodes,
  ITaskTargetRelations,
} from "../../../utils/interface/Task";
import {Button} from "@material-tailwind/react";

// 添加 window.vis 類型宣告
declare global {
  interface Window {
    vis: any;
  }
}

// 子任務組件
const SubTargetComponent = (props: {
  index: number;
  title: string;
  description: string;
  targetNodes?: ITaskTargetNodes[];
  targetRelations?: ITaskTargetRelations[];
}) => {
  const {index, title, description, targetNodes, targetRelations} = props;

  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<any>(null);
  const [visLoaded, setVisLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [showGraph, setShowGraph] = useState(false);

  console.log(targetNodes, targetRelations)

  // 檢查是否有圖譜數據可用
  const hasGraphData = Array.isArray(targetNodes) && Array.isArray(targetRelations) && targetNodes.length > 0;

  // 轉換節點和關係為 vis.js 需要的格式
  const graphData = useMemo(() => {
    if (!hasGraphData) return null;

    console.log(`SubTarget ${index}: Processing graph data with ${targetNodes.length} nodes and ${targetRelations.length} relations`);

    const nodes = targetNodes.map(node => ({
      id: node.id,
      label: node.label,
      color: node.color || '#3B82F6',
      size: node.size || 30,
      description: node.description || '',
      original: true
    }));

    const edges = targetRelations.map((relation, idx) => ({
      id: relation.id || `e${idx}`,
      from: relation.from,
      to: relation.to,
      label: relation.label || '',
      color: relation.color || '#64748b',
      width: relation.width || 2
    }));

    return {nodes, edges};
  }, [targetNodes, targetRelations, hasGraphData, index]);

  // 動態載入 vis-network (只有在需要顯示圖形且有數據時)
  useEffect(() => {
    if (!showGraph || !hasGraphData) return;

    const loadVis = async () => {
      try {
        console.log(`SubTarget ${index}: Loading vis.js libraries`);
        // 動態導入 vis 相關庫，與 admin 版本保持一致
        const [{Network}, {DataSet}] = await Promise.all([
          import('vis-network/standalone'),
          import('vis-data/standalone')
        ]);

        window.vis = {Network, DataSet};
        setVisLoaded(true);
      } catch (error) {
        console.error(`SubTarget ${index}: Failed to load vis-network:`, error);
      }
    };

    if (!visLoaded) {
      loadVis();
    }
  }, [visLoaded, hasGraphData, showGraph, index]);

  // 初始化網路圖
  const initializeNetwork = () => {
    if (!networkRef.current || !visLoaded || !window.vis || !graphData) return;

    console.log(`SubTarget ${index}: Initializing network with ${graphData.nodes.length} nodes and ${graphData.edges.length} edges`);

    const {nodes, edges} = graphData;
    const {Network, DataSet} = window.vis;

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges)
    };

    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30,
        },
        font: {
          size: 84,  // 適當的字體大小
          face: 'Arial',
          color: '#ffffff',
          strokeWidth: 5,
          strokeColor: '#000000'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 5,
          x: 2,
          y: 2
        }
      },
      edges: {
        width: 2,
        color: {
          color: '#64748b',
          highlight: '#3B82F6',
          hover: '#3B82F6'
        },
        smooth: {
          type: 'continuous',
          roundness: 0.5
        },
        arrows: {
          to: {enabled: true, scaleFactor: 1, type: 'arrow'}
        },
        font: {
          size: 50,  // 適當的字體大小
          color: '#374151',
          strokeWidth: 3,  // 添加黑邊
          strokeColor: '#000000'  // 添加黑邊顏色
        }
      },
      physics: {
        stabilization: {iterations: 100},
        barnesHut: {
          gravitationalConstant: -30000,
          springConstant: 0.001,
          springLength: 100,
        },
      },
      interaction: {
        tooltipDelay: 200,
        hover: true,
        zoomView: true,
        dragView: true,
      },
      layout: {
        improvedLayout: true
      },
      autoResize: true,
      height: '100%',  // 改為 100% 以填滿父容器
      width: '100%'
    };

    if (networkRef.current) {
      // 如果已存在網絡實例，先清除
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }

      networkInstance.current = new Network(networkRef.current, data, options);

      // 添加事件監聽器
      networkInstance.current.on("click", function (params: any) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = data.nodes.get(nodeId);
          console.log(`SubTarget ${index}: Node clicked: ${node.label}`);
        }
      });

      networkInstance.current.on("hoverNode", function (params: any) {
        const nodeId = params.node;
        const node = data.nodes.get(nodeId);
        setHoveredNode(node);
      });

      networkInstance.current.on("blurNode", function () {
        setHoveredNode(null);
      });

      // 網路圖載入完成後適應容器
      networkInstance.current.once("stabilizationIterationsDone", function () {
        if (networkInstance.current) {
          networkInstance.current.fit();
          setIsLoading(false);
        }
      });
    }
  };

  // 當 vis 載入完成或圖形數據更新時，初始化網絡圖
  useEffect(() => {
    if (networkRef.current && visLoaded && graphData && showGraph) {
      setIsLoading(true);
      initializeNetwork();
    }

    return () => {
      // 組件卸載時清除網絡實例
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [visLoaded, graphData, showGraph]);

  const handleFitView = () => {
    if (networkInstance.current) {
      networkInstance.current.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
  };

  return (
    <div className='flex flex-col p-4 gap-y-3 border-2 border-stamindTask-black-600 rounded-2xl'>
      <h3
        className='text-[1.5rem]'
        data-action='click'
        data-type='text'
        data-object='subTarget'
        data-id='task_subTarget'
      >🟢 子目標：{title}</h3>
      <p
        data-action='click'
        data-type='text'
        data-object='subTargetDescription'
        data-id='task_subTargetDescription'
      >
        <MarkDownTextComponent text={description}/>
      </p>

      {/* 圖譜顯示區域 */}
      {hasGraphData && (
        <div className="my-4">

          <Button
            variant="text"
            color="blue"
            placeholder={undefined}
            size="sm"
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2 mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
            </svg>
            {showGraph ? "隱藏知識圖譜" : `顯示知識圖譜 (${targetNodes?.length || 0}節點, ${targetRelations?.length || 0}關係)`}
          </Button>
          {showGraph && (
            <div className="relative h-[360px] mt-4">
              {/* Vis.js 網路圖容器 */}
              <div
                className="border rounded-md overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 relative h-full">
                {/* 載入狀態 */}
                {(isLoading || !visLoaded) && (
                  <div
                    className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                    <div
                      className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center animate-pulse mb-2">
                      <span className="text-white font-bold">🧠</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {!visLoaded ? '載入圖譜庫...' : '渲染知識圖譜...'}
                    </p>
                  </div>
                )}

                <div ref={networkRef} className="w-full h-full bg-gradient-to-br"/>

                {/* 節點信息彈出框 */}
                {hoveredNode && (
                  <div
                    className="absolute top-2 left-2 max-w-xs bg-white p-2 rounded shadow-md border-l-2 border-blue-500 z-20 text-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: hoveredNode.color}}></div>
                      <strong>{hoveredNode.label}</strong>
                    </div>
                    {hoveredNode.description && (
                      <p className="text-xs text-gray-600">{hoveredNode.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* 控制按鈕 */}
              <div className="flex justify-end mt-1">
                <button
                  className="text-xs py-1 px-2 text-blue-600 hover:text-blue-800"
                  disabled={isLoading || !visLoaded}
                  onClick={handleFitView}
                >
                  重置視圖
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 主目標組件
const TargetComponent = (props: ITaskContentProps) => {
  const {taskId, selectNode} = props;

  const [targetTitle, setTargetTitle] = useState<string>("");
  const [targetDescription, setTargetDescription] = useState<string>("");
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([]);
  // 與 admin 版本一致，使用二維數組來存儲圖譜數據
  const [targetNodes, setTargetNodes] = useState<ITaskTargetNodes[][]>([[]]);
  const [targetRelations, setTargetRelations] = useState<ITaskTargetRelations[][]>([[]]);

  useEffect(() => {
    const fetchTaskTarget = async () => {
      try {
        const response = await API_getTaskTarget(taskId || '');
        console.log("API 回傳數據:", response.data);

        const title = response.data.target_titles[selectNode.key] || "";
        const description = response.data.target_descriptions[selectNode.key] || "";
        const subTargets = response.data.sub_target_list[selectNode.key] || [];
        // 初始化圖譜數據結構
        let nodesData: ITaskTargetNodes[][] = response.data.target_nodes;
        let relationsData: ITaskTargetRelations[][] = response.data.target_relations;

        setTargetNodes(nodesData);
        setTargetRelations(relationsData);

        // 處理子目標數據
        const processedSubTargets = subTargets.map((subTarget: ITaskSubTarget, index: number) => {
          return {
            ...subTarget,
            targetNodes: nodesData[index] || [],
            targetRelations: relationsData[index] || []
          };
        });

        setTargetTitle(title);
        setTargetDescription(description);
        setSubTargetList(processedSubTargets);

      } catch (error) {
        console.error("獲取目標數據時出錯:", error);
      }
    };

    fetchTaskTarget();
  }, [taskId, selectNode]);

  return (
    <div className='flex flex-col items-center h-[80vh]'>
      <div className='flex flex-col gap-y-5 w-[80%]'>
        <h3
          className='text-[2rem]'
          data-action='click'
          data-type='text'
          data-object='target'
          data-id='task_target'
        >❓學習目標：{targetTitle}</h3>
        <p
          data-action='click'
          data-type='text'
          data-object='targetDescription'
          data-id='task_targetDescription'
        >{targetDescription}</p>
      </div>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 h-[60vh] border-stamindTask-black-850'>
        {subTargetList.map((subTarget, index) => (
          <SubTargetComponent
            key={index}
            index={index}
            title={subTarget.title}
            description={subTarget.description}
            targetNodes={targetNodes[index]}
            targetRelations={targetRelations[index]}
          />
        ))}
      </div>
    </div>
  )
}

export default TargetComponent
