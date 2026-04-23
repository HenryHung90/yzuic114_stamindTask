import {useEffect, useState, useMemo, useRef} from "react";
// style
import {Button, Input, Textarea} from "@material-tailwind/react";
// API
// components
import AlertMsg from "../../../../components/Alert/Alert";

// interface
import {
  ITaskSubTarget,
  ITaskTargetNodes,
  ITaskTargetRelations,
  ITaskSubTargetProps,
  ITaskTargetProps
} from "../../../../utils/interface/Task";
import {API_generateSubTargetGraph, API_getTaskTarget, API_uploadTaskTarget} from "../../../../utils/API/API_Targets";
import MarkDownTextComponent from "../../../../components/MarkDownText/MarkDownText";

// 添加 window.vis 類型宣告
declare global {
  interface Window {
    vis: any;
  }
}

const SubTargetComponent = (props: ITaskSubTargetProps) => {
  const {
    index,
    title,
    description,
    targetGraphDescriptions,
    targetNodes,
    targetRelations,
    generatedGraph,
    handleEditSubTargetTitle,
    handleDeleteSubTargetTitle,
    handleGenerateSubTargetGraph
  } = props;

  if (index === undefined) return null;

  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<any>(null);
  const [visLoaded, setVisLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [showGraph, setShowGraph] = useState(false);


  // 檢查是否有圖譜數據可用
  const hasGraphData = targetNodes && targetRelations && targetNodes.length > 0;

  // 轉換節點和關係為 vis.js 需要的格式
  const graphData = useMemo(() => {
    if (!targetNodes || !targetRelations) return null;

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
      id: `e${idx}`,
      from: relation.from,
      to: relation.to,
      label: relation.label || '',
      color: relation.color || '#64748b',
      width: relation.width || 2
    }));

    return {nodes, edges};
  }, [targetNodes, targetRelations, index]);

  // 動態載入 vis-network (只有在需要顯示圖形且有數據時)
  useEffect(() => {
    if (!showGraph || !hasGraphData) return;

    const loadVis = async () => {
      try {
        console.log(`SubTarget ${index}: Loading vis.js libraries`);
        // 動態導入 vis 相關庫
        const [{Network}, {DataSet}] = await Promise.all([
          import('vis-network'),
          import('vis-data')
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
      <Input
        variant="standard"
        label="學習子目標"
        placeholder="請輸入學習子目標"
        crossOrigin={undefined}
        value={title}
        onChange={(e) => handleEditSubTargetTitle(index, 'title', e.target.value)}
      />
      <Input
        variant="standard"
        label="子目標描述"
        placeholder="請輸入子目標描述"
        crossOrigin={undefined}
        value={description}
        onChange={(e) => handleEditSubTargetTitle(index, 'description', e.target.value)}
      />
      <div className='h-64 overflow-auto'>
        <MarkDownTextComponent text={targetGraphDescriptions}/>
      </div>
      {/* 圖譜顯示區域 */}
      {hasGraphData && (
        <div className="mt-2">
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
            <div className="relative h-[360px]">
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
                <Button
                  variant="text"
                  size="sm"
                  color="blue"
                  placeholder={undefined}
                  disabled={isLoading || !visLoaded}
                  onClick={handleFitView}
                  className="text-xs py-1"
                >
                  重置視圖
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className='flex gap-x-3 mt-2'>
        <Button
          variant="gradient"
          placeholder={undefined}
          color='red'
          size='sm'
          className='flex items-center text-center w-14'
          onClick={(e) => handleDeleteSubTargetTitle(index)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor"
               className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
          </svg>
        </Button>
        <Button
          variant="gradient"
          placeholder={undefined}
          size='md'
          color='blue'
          disabled={generatedGraph}
          className='flex items-center text-center'
          onClick={(e) => handleGenerateSubTargetGraph(index, title, description)}
        >
          產生子任務圖
        </Button>
      </div>
    </div>
  )
}

const TargetComponent = (props: ITaskTargetProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading, savingTrigger} = props

  const [targetTitle, setTargetTitle] = useState<string>("")
  const [targetDescription, setTargetDescription] = useState<string>("")
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])
  const [targetNodes, setTargetNodes] = useState<ITaskTargetNodes[][]>([[]])
  const [targetRelations, setTargetRelations] = useState<ITaskTargetRelations[][]>([[]])
  const [targetGraphDescriptions, setTargetGraphDescriptions] = useState<Array<string>>([])
  const [generatedGraph, setGeneratedGraph] = useState(false);

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  const handleAddNewSubTarget = () => {
    setSubTargetList(prevState => {
      return [...prevState, {title: '', description: ''}]
    })
  }

  // 更新陣列中的內容
  const handleEditSubTargetTitle = (index: number, key: 'title' | 'description', value: string) => {
    setSubTargetList(prevState => {
      const updateList = [...prevState]
      updateList[index] = {
        ...updateList[index],
        [key]: value,
      }
      return updateList
    })
  }

  // 刪除陣列中的內容
  const handleDeleteSubTargetTitle = (index: number) => {
    setSubTargetList(prevState => prevState.filter((_, i) => i !== index))
  }

  // 針對子任務新增圖譜描述建置
  const handleGenerateSubTargetGraph = async (index: number, title: string, description: string) => {
    if (!title || !description) {
      alert("請先填寫子任務的標題與描述")
      return
    }

    setAlertOpen(true);
    setAlertContent("🟠產生知識圖譜中...");
    setGeneratedGraph(true);

    try {
      const response = await API_generateSubTargetGraph(taskId || '', index, title, description);
      if (response.data && response.data.graph_data.nodes && response.data.graph_data.edges) {
        setTargetNodes(prevNodes => {
          const newNodes = [...prevNodes];
          while (newNodes.length <= index) {
            newNodes.push([]);
          }
          newNodes[index] = response.data.graph_data.nodes;
          return newNodes;
        });

        setTargetRelations(prevRelations => {
          const newRelations = [...prevRelations];
          while (newRelations.length <= index) {
            newRelations.push([]);
          }
          newRelations[index] = response.data.graph_data.edges;
          return newRelations;
        });

        setAlertContent("🟢圖譜生成成功！");
        setGeneratedGraph(false);
      } else {
        setAlertContent("🟠圖譜返回數據格式不符合預期，請檢查 API");
      }
    } catch (error) {
      console.error("生成圖譜時發生錯誤:", error);
      setAlertContent("🔴生成圖譜時發生錯誤");
    }
  }

  useEffect(() => {
    const fetchTaskTarget = async () => {
      const response = await API_getTaskTarget(taskId || '');

      const title = response.data.target_titles[selectNode.key];
      const description = response.data.target_descriptions[selectNode.key];
      const subTargetList = response.data.sub_target_list[selectNode.key];
      const targetNodes = response.data.target_nodes;
      const targetRelations = response.data.target_relations;
      const targetGraphDescriptions = response.data.target_graph_descriptions

      setTargetTitle(title || '');
      setTargetDescription(description || '');
      setTargetGraphDescriptions(targetGraphDescriptions || []);
      if (subTargetList) setSubTargetList(subTargetList);

      // 檢查圖譜數據結構
      if (targetNodes) setTargetNodes(targetNodes);
      if (targetRelations) setTargetRelations(targetRelations);

    };

    fetchTaskTarget();
  }, [taskId, selectNode.key]);

  useEffect(() => {
    const uploadTaskTarget = async () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_uploadTaskTarget(taskId || '', selectNode.key, targetTitle, targetDescription, subTargetList).then(response => {
        setAlertContent(`🟢更新成功:${response.message}`)
      })
    }
    if (savingTrigger > 0) uploadTaskTarget()
  }, [savingTrigger])

  return (
    <div className='flex flex-col items-center h-[80vh]'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='flex flex-col gap-y-5 w-[80%]'>
        <Input
          variant="standard"
          label="學習目標"
          placeholder="請輸入學習目標"
          crossOrigin={undefined}
          value={targetTitle}
          onChange={(e) => setTargetTitle(e.target.value)}
        />
        <Textarea
          variant="outlined"
          label="詳細描述"
          value={targetDescription}
          onChange={(e) => setTargetDescription(e.target.value)}
        />
      </div>
      <div className='overflow-auto flex flex-col gap-y-5 mt-5 pt-4 w-[80%] border-stamindTask-black-850'>
        {subTargetList.map(({title, description}, index) => (
          <SubTargetComponent key={index} index={index} title={title} description={description}
                              targetNodes={targetNodes[index]} targetRelations={targetRelations[index]}
                              targetGraphDescriptions={targetGraphDescriptions[index]}
                              generatedGraph={generatedGraph}
                              handleEditSubTargetTitle={handleEditSubTargetTitle}
                              handleDeleteSubTargetTitle={handleDeleteSubTargetTitle}
                              handleGenerateSubTargetGraph={handleGenerateSubTargetGraph}
          />
        ))}
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleAddNewSubTarget}
          className='min-h-11'
        >
          新增子任務
        </Button>
      </div>
    </div>
  )
}

export default TargetComponent
