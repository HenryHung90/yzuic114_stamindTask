import React, {useEffect, useRef, useState} from "react";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

declare global {
  interface Window {
    vis: any;
  }
}

interface IGraphData {
  nodes: Array<{
    id: number;
    label: string;
    color: string;
    size: number;
    description?: string; // 添加描述字段
    original?: boolean;
    community?: boolean;
    community_center?: boolean;
    exploration?: boolean;
    exploration_entity?: boolean;
    importance_score?: number;
    exploration_type?: string;
  }>;
  edges: Array<{
    id: string;
    from: number;
    to: number;
    label: string;
    color: string;
    width: number;
  }>;
}

interface IGraphDialogProps {
  open: boolean;
  onClose: () => void;
  onClickNode: (nodeTitle: string) => void;
  taskId: string;
  graphData?: IGraphData | null;
}

const GraphDialogComponent = (props: IGraphDialogProps) => {
  const {open, onClose, onClickNode, taskId, graphData} = props;
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [visLoaded, setVisLoaded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  // 動態載入 vis-network
  useEffect(() => {
    const loadVis = async () => {
      try {
        const [{Network}, {DataSet}] = await Promise.all([
          import('vis-network'),
          import('vis-data')
        ]);

        window.vis = {Network, DataSet};
        setVisLoaded(true);
      } catch (error) {
        console.error('Failed to load vis-network:', error);
      }
    };

    if (!visLoaded) {
      loadVis();
    }
  }, [visLoaded]);

  // 初始化網路圖
  const initializeNetwork = () => {
    if (!networkRef.current || !visLoaded || !window.vis || !graphData) return;

    const {nodes, edges} = graphData;

    setNodeCount(nodes.length);
    setEdgeCount(edges.length);

    const {Network, DataSet} = window.vis;

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges)
    };

    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 50,
          max: 150,
        },
        font: {
          size: 60,
          face: 'Arial',
          color: 'white',
          strokeWidth: 2,
          strokeColor: '#000000'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 10,
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
          to: {enabled: true, scaleFactor: 1.5, type: 'arrow'}
        },
        font: {
          size: 30,
          color: '#374151',
        }
      },
      physics: {
        stabilization: {iterations: 100},
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200,
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
      height: '600px',
      width: '100%'
    };

    if (networkRef.current) {
      networkInstance.current = new Network(networkRef.current, data, options);

      // 添加事件監聽器
      networkInstance.current.on("click", function (params: any) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = data.nodes.get(nodeId);
          console.log('點擊節點:', node);

          // 如果節點不是 community 類型，則觸發 onClickNode 回調
          if (node && !node.community) {
            onClickNode(node.label);
            onClose();
          }
        }
      });

      networkInstance.current.on("hoverNode", function (params: any) {
        const nodeId = params.node;
        const node = data.nodes.get(nodeId);
        console.log('Hover 節點:', node);
        setHoveredNode(node);
      });

      networkInstance.current.on("blurNode", function () {
        setHoveredNode(null);
      });

      networkInstance.current.on("hoverEdge", function (params: any) {
        console.log('Hover 邊:', params.edge);
      });

      // 網路圖載入完成後適應容器
      networkInstance.current.once("stabilizationIterationsDone", function () {
        if (networkInstance.current) {
          networkInstance.current.fit();
        }
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (open && networkRef.current && visLoaded && graphData) {
      setIsLoading(true);
      initializeNetwork();
    }

    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, [open, visLoaded, graphData]);

  const handleRefresh = () => {
    if (!graphData) return;

    setIsLoading(true);
    if (networkInstance.current) {
      networkInstance.current.destroy();
      networkInstance.current = null;
    }
    initializeNetwork();
  };

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

  // 如果沒有圖譜數據，顯示提示
  if (open && !graphData) {
    return (
      <>
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100000]"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[100001] flex items-center justify-center">
          <div className="w-full max-w-2xl mx-4">
            <Card
              placeholder={undefined}
              className="bg-stamindTask-white-200 shadow-2xl"
            >
              <CardHeader
                placeholder={undefined}
                className="flex justify-between items-center bg-stamindTask-black-850 text-white m-0 rounded-none"
              >
                <Typography
                  variant="h4"
                  color="white"
                  placeholder={undefined}
                  className="font-bold ml-4"
                >
                  知識圖譜
                </Typography>
                <IconButton
                  variant="text"
                  color="white"
                  onClick={onClose}
                  placeholder={undefined}
                  className="hover:bg-stamindTask-black-700"
                >
                  <XMarkIcon className="h-5 w-5"/>
                </IconButton>
              </CardHeader>

              <CardBody
                placeholder={undefined}
                className="p-8 text-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Typography
                    variant="h2"
                    color="gray"
                    placeholder={undefined}
                    className="font-bold"
                  >
                    🧠
                  </Typography>
                </div>
                <Typography
                  variant="h5"
                  color="blue-gray"
                  placeholder={undefined}
                  className="mb-4"
                >
                  尚無圖譜數據
                </Typography>
                <Typography
                  variant="paragraph"
                  color="gray"
                  placeholder={undefined}
                  className="mb-6"
                >
                  請先在聊天室中輸入問題，然後點擊「深度學習」、「相關知識」或「下一步」按鈕來生成 AI 推薦的知識圖譜。
                </Typography>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    placeholder={undefined}
                    className="font-medium"
                  >
                    💡 使用提示：
                  </Typography>
                  <Typography
                    variant="small"
                    color="gray"
                    placeholder={undefined}
                    className="mt-2"
                  >
                    1. 在聊天室輸入您想深入了解的主題<br/>
                    2. 點擊左側的的三個不同按鈕<br/>
                    3. Amum Amum 將為您生成相關的知識圖譜
                  </Typography>
                </div>
              </CardBody>

              <CardFooter
                placeholder={undefined}
                className="bg-gray-50 flex justify-end m-0 rounded-b-lg"
              >
                <Button
                  variant="filled"
                  color="blue"
                  onClick={onClose}
                  placeholder={undefined}
                >
                  我知道了
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100000]"
          onClick={onClose}
        />
      )}
      <div
        className="fixed inset-0 z-[100001] flex items-center justify-center"
        style={{display: open ? 'flex' : 'none', pointerEvents: open ? 'auto' : 'none'}}
      >
        <div className="w-full max-w-6xl mx-4">
          <Card
            placeholder={undefined}
            className="bg-stamindTask-white-200 shadow-2xl max-h-[90vh] flex flex-col"
          >
            <CardHeader
              placeholder={undefined}
              className="flex justify-between items-center bg-stamindTask-black-850 text-white m-0 rounded-tr-xl rounded-tl-xl"
            >
              <div className="flex items-center space-x-4">
                <Typography
                  variant="h4"
                  color="white"
                  placeholder={undefined}
                  className="font-bold ml-4"
                >
                  知識圖譜 Task-{taskId}
                </Typography>
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  🧠 AI 推薦
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IconButton
                  variant="text"
                  color="white"
                  onClick={onClose}
                  placeholder={undefined}
                  className="hover:bg-stamindTask-black-700"
                  data-action="click"
                  data-type="button"
                  data-object="closeGraphDialog"
                  data-id="graphDialog_close"
                >
                  <XMarkIcon className="h-5 w-5"/>
                </IconButton>
              </div>
            </CardHeader>

            <CardBody
              placeholder={undefined}
              className="p-0 overflow-hidden flex-1 relative"
            >
              {/* 載入狀態 */}
              {(isLoading || !visLoaded) && (
                <div
                  className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10">
                  <div
                    className="w-16 h-16 bg-stamindTask-primary-blue-600 rounded-full flex items-center justify-center animate-pulse mb-4">
                    <Typography
                      variant="h3"
                      color="white"
                      placeholder={undefined}
                      className="font-bold"
                    >
                      🧠
                    </Typography>
                  </div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    placeholder={undefined}
                    className="text-center mb-2"
                  >
                    {!visLoaded ? '載入圖譜庫...' : '正在渲染 AI 推薦圖譜...'}
                  </Typography>
                  <div className="w-64 bg-gray-200 rounded-full h-2">
                    <div className="bg-stamindTask-primary-blue-600 h-2 rounded-full animate-pulse"
                         style={{width: visLoaded ? '75%' : '30%'}}></div>
                  </div>
                </div>
              )}

              {/* Vis.js 網路圖容器 */}
              <div
                ref={networkRef}
                className="bg-gradient-to-br from-slate-50 to-blue-50"
              />

              {/* 節點描述彈出框 */}
              {hoveredNode && (
                <div
                  className="absolute max-w-md bg-white bg-opacity-95 p-4 rounded-lg shadow-lg border-l-4 border-blue-500 z-20"
                  style={{
                    top: '16px',
                    left: '16px',
                  }}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: hoveredNode.color}}></div>
                    <Typography variant="h6" color="blue-gray" placeholder={undefined} className="font-bold">
                      {hoveredNode.label}
                    </Typography>
                  </div>

                  {hoveredNode.description && (
                    <Typography variant="small" color="gray" placeholder={undefined} className="mb-2">
                      {hoveredNode.description}
                    </Typography>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {hoveredNode.original && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">核心概念</span>
                    )}
                    {hoveredNode.community && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">知識社群</span>
                    )}
                    {hoveredNode.community_center && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">社群核心</span>
                    )}
                    {hoveredNode.exploration && hoveredNode.exploration_type === 'higher_level' && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs">更廣泛概念</span>
                    )}
                    {hoveredNode.exploration && hoveredNode.exploration_type === 'lower_level' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">更專業概念</span>
                    )}
                    {hoveredNode.exploration_entity && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">相關概念</span>
                    )}
                  </div>
                </div>
              )}

              {/* 圖例 */}
              {!isLoading && visLoaded && (
                <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg border max-w-xs">
                  <Typography variant="small" color="blue-gray" placeholder={undefined} className="font-bold mb-2">
                    🧠 AI 推薦圖例
                  </Typography>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>核心概念</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>知識社群</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span>更廣泛概念</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      <span>更專業概念</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                      <span>相關實體</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作提示 */}
              {!isLoading && visLoaded && (
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 p-2 rounded-lg shadow-lg border">
                  <Typography variant="small" color="gray" placeholder={undefined} className="text-xs">
                    💡 拖拽移動 • 滾輪縮放 • hover 節點查看詳情 • 邊標籤顯示關係類型 • 點擊節點詢問相關問題
                  </Typography>
                </div>
              )}
            </CardBody>

            <CardFooter
              placeholder={undefined}
              className="bg-gray-50 flex justify-between items-center m-0 rounded-b-lg"
            >
              <div className="flex items-center space-x-4">
                <Typography variant="small" color="gray" placeholder={undefined}>
                  節點: {nodeCount} | 連結: {edgeCount}
                </Typography>
                <Typography variant="small" color="green" placeholder={undefined}>
                  ● AI 數據已載入
                </Typography>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="text"
                  color="blue"
                  onClick={handleFitView}
                  placeholder={undefined}
                  data-action="click"
                  data-type="button"
                  data-object="fitViewGraphDialog"
                  data-id="graphDialog_fitView"
                  disabled={isLoading || !visLoaded}
                  size="sm"
                >
                  位置復原
                </Button>
                <Button
                  variant="text"
                  color="gray"
                  onClick={onClose}
                  placeholder={undefined}
                  data-action="click"
                  data-type="button"
                  data-object="cancelGraphDialog"
                  data-id="graphDialog_cancel"
                >
                  關閉
                </Button>
                <Button
                  variant="filled"
                  color="blue"
                  onClick={handleRefresh}
                  placeholder={undefined}
                  data-action="click"
                  data-type="button"
                  data-object="refreshGraphDialog"
                  data-id="graphDialog_refresh"
                  disabled={isLoading || !visLoaded}
                >
                  重新載入
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GraphDialogComponent;
