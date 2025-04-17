import React, {useEffect} from 'react'
import * as go from 'gojs'
// style
// API
// components
import {calculateExperienceStep} from "../../utils/functions/tasks/experience";

// interface
import {Link, Node} from '../../pages/admin/task/Task'
import {EGroupType} from "../../utils/functions/common"

interface IDiagramInitProps {
  divRef: React.RefObject<HTMLDivElement>
  diagramRef: React.RefObject<go.Diagram>
  groupType?: EGroupType
  setDiagramRef: (diagram: go.Diagram | null) => void
  setSelectNode?: React.Dispatch<React.SetStateAction<{ key: number, category: string, text: string }>>
  nodeDataArray: Array<Node>
  linkDataArray: Array<Link>
  isEditMode: boolean
}

const DiagramInitComponent = (props: IDiagramInitProps) => {
  const {
    divRef,
    diagramRef,
    groupType,
    setDiagramRef,
    setSelectNode,
    nodeDataArray,
    linkDataArray,
    isEditMode
  } = props

  function filterNodeForGroup(node: Array<Node>) {
    for (const item of nodeDataArray) {
      if (groupType === EGroupType.CONTROL && (item.text == '計畫設定' || item.text == '自我反思')) {
        item.text = '繼續加油～'
      }
    }
  }

  // 初始化圖表
  useEffect(() => {
    if (!divRef.current) return;

    const $ = go.GraphObject.make;

    // 建立圖表
    const diagram = $(go.Diagram, divRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone,
      ...(isEditMode && {
        layout: $(go.TreeLayout, {
          layerSpacing: 70
        })
      })
    });

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    // makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
    function makePort(name: string, align: any, spot: any, output: boolean, input: boolean) {
      let horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
      // the port is basically just a transparent rectangle that stretches along the side of the node,
      // and becomes colored when the mouse passes over it
      return $(go.Shape,
        {
          fill: "transparent",  // changed to a color in the mouseEnter event handler
          strokeWidth: 0,  // no stroke
          width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
          alignment: align,  // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name,  // declare this object to be a "port"
          fromSpot: spot,  // declare where links may connect at this port
          fromLinkable: output,  // declare whether the user may draw links from here
          toSpot: spot,  // declare where links may connect at this port
          toLinkable: input,  // declare whether the user may draw links to here
          cursor: "pointer",  // show a different cursor to indicate potential link point
          mouseEnter: (e: any, port: any) => {  // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: (e: any, port: any) => port.fill = "transparent"
        });
    }

    function textStyle() {
      return {
        font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
        stroke: "#F8F8F8"
      }
    }

    // helper definitions for node templates
    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center
        }
      ];
    }

    const standardSetting = $(go.Node, "Table", nodeStyle(), {deletable: false},
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          {fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5},
          new go.Binding("figure", "figure")
        ),
        $(go.TextBlock, textStyle(),
          {
            margin: 15,
            maxSize: new go.Size(160, 160),
            wrap: go.TextBlock.WrapFit,
            editable: false,
            textAlign: 'center',
          },
          //攜結text 呼叫時會使用建立之node 名稱作為內部text
          //綁定TextBlock.text 屬性爲Node.data.name的值，Model對象可以通過Node.data.name獲取和設置TextBlock.text
          new go.Binding("text").makeTwoWay()
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
        makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    )

    const completedSetting = $(go.Node, "Table", nodeStyle(), {deletable: false},
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          {fill: "#FFC78E", stroke: "#FFD306", strokeWidth: 3.5},
          new go.Binding("figure", "figure")
        ),
        $(go.TextBlock,
          {
            font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: 'black'
          },
          {
            margin: 10,
            maxSize: new go.Size(160, 160),
            wrap: go.TextBlock.WrapFit,
            editable: false,
            textAlign: 'center',
          },
          //攜結text 呼叫時會使用建立之node 名稱作為內部text
          //綁定TextBlock.text 屬性爲Node.data.name的值，Model對象可以通過Node.data.name獲取和設置TextBlock.text
          new go.Binding("text").makeTwoWay()
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
        makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
        makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
        makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
      )
    )

    // 體驗任務
    diagram.nodeTemplateMap.add("Experience", standardSetting)
    // 學習目標
    diagram.nodeTemplateMap.add("Target", standardSetting)
    // 計畫設定
    diagram.nodeTemplateMap.add("Plan", standardSetting)
    // 計劃執行+學習教材
    diagram.nodeTemplateMap.add("Process", standardSetting)
    // 自我反思
    diagram.nodeTemplateMap.add("Reflection", standardSetting)
    // 教師回饋
    diagram.nodeTemplateMap.add("Feedback", standardSetting)

    diagram.nodeTemplateMap.add("Completed-Experience", completedSetting)
    diagram.nodeTemplateMap.add("Completed-Target", completedSetting)
    diagram.nodeTemplateMap.add("Completed-Plan", completedSetting)
    diagram.nodeTemplateMap.add("Completed-Process", completedSetting)
    diagram.nodeTemplateMap.add("Completed-Reflection", completedSetting)
    diagram.nodeTemplateMap.add("Completed-Feedback", completedSetting)


    // 設定連線樣板
    diagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          corner: 10,
          curve: go.Link.JumpGap,
          toShortLength: 10,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          // mouse-overs subtly highlight links:
          //滑鼠滑至連接線上會產生之動畫
          // mouseEnter: (e, link) => link.findObject("HIGHLIGHT").stroke = "rgba(255,255,255,0.8)",
          // mouseLeave: (e, link) => link.findObject("HIGHLIGHT").stroke = "transparent",
          selectionAdorned: false
        },
        new go.Binding("points").makeTwoWay(),

        //HighLight 線條
        $(go.Shape,  // the highlight shape, normally transparent
          {isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT"}),

        //線條Style
        $(go.Shape,  // the link path shape
          {isPanelMain: true, stroke: "rgb(255,100,100)", strokeWidth: 3},
          //sel => 是否被選中
          new go.Binding("stroke", "isSelected", sel => sel ? "orange" : "gray").ofObject()),


        //箭頭指標樣式
        $(go.Shape,  // the arrowhead scale=>大小
          {toArrow: "standard", scale: 2, strokeWidth: 0, fill: 'gray'}),

        //自定義一個 Panel 在線上
        //自定義樣式 visible 預設看不到 name=>設定LANBEL 在showLinkLabel() function 中
        //若發現名稱為 Ｃonditional 的分類 則讓 LABEL顯現
        $(go.Panel, "Auto",  // the link label, normally not visible
          {visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),

          $(go.Shape, "RoundedRectangle",  // the label shape
            {fill: "#F8F8F8", strokeWidth: 0}),
          $(go.TextBlock, "Yes",  // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    // 添加事件監聽
    diagram.addDiagramListener("ObjectDoubleClicked", (e: go.DiagramEvent) => {
      const part = e.subject.part;
      if (part instanceof go.Node) {
        if (setSelectNode) {
          setSelectNode({
            category: part.data.category,
            text: part.data.text,
            key: calculateExperienceStep(part.data.key)
          });
        }
      }
    });

    // 資料過濾
    filterNodeForGroup(nodeDataArray)
    // 設置初始資料
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal

    // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
    function animateFadeDown(e: any) {
      let diagram = e.diagram;
      let animation = new go.Animation();
      animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
      animation.easing = go.Animation.EaseOutExpo;
      animation.duration = 900;
      // Fade "down", in other words, fade in from above
      animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
      animation.add(diagram, 'opacity', 0, 1);
      animation.start();
    }

    if (isEditMode) {
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          // Instead of the default animation, use a custom fade-down
          "animationManager.initialAnimationStyle": go.AnimationManager.None,
          "InitialAnimationStarting": animateFadeDown, // Instead, animate with this function
          //禁止縮放
          allowZoom: false,

          nodeTemplateMap: diagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            {category: "Experience", text: "體驗任務"},
            {category: "Target", text: "學習目標"},
            {category: "Plan", text: "計畫設定"},
            {category: "Process", text: "計劃執行"},
            {category: "Reflection", text: "自我反思"},
            {category: "Feedback", text: "總體回饋"},
            {category: "Completed-Experience", text: "體驗任務"},
            {category: "Completed-Target", text: "學習目標"},
            {category: "Completed-Plan", text: "計畫設定"},
            {category: "Completed-Process", text: "計劃執行"},
            {category: "Completed-Reflection", text: "自我反思"},
            {category: "Completed-Feedback", text: "總體回饋"}
          ])
        });

      diagram.addDiagramListener('SelectionDeleting', function (e) {
        // the DiagramEvent.subject is the collection of Parts about to be deleted
        e.subject.each(async function (part: any) {
          // console.log(part.ob)
          deleteNode(part)
        });
      });

      diagram.model.addChangedListener((e) => {
        if (e.isTransactionFinished) {
          // 當一個交易完成時，更新 nodes 和 links
          const updatedNodes = (diagram.model as go.GraphLinksModel).nodeDataArray;
          const updatedLinks = (diagram.model as go.GraphLinksModel).linkDataArray;
        }
      })


      const deleteNode = (part: any) => {
        const animateDeletion = (part: any) => {
          if (!(part instanceof go.Node)) return; // only animate Nodes
          let animation = new go.Animation();
          let deletePart = part.copy();
          animation.add(deletePart, "scale", deletePart.scale, 0.01);
          animation.add(deletePart, "angle", deletePart.angle, 360);
          animation.addTemporaryPart(deletePart, diagram);
          animation.start();
        }

        animateDeletion(part)
        diagram.remove(part)
      }
    }

    // 保存圖表實例到 ref
    setDiagramRef(diagram);

    // 清理函數
    return () => {
      diagram.div = null;
    };
  }, [])

  // 當資料變更時更新圖表
  useEffect(() => {
    if (diagramRef.current) {
      // 資料過濾
      filterNodeForGroup(nodeDataArray)
      diagramRef.current.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }
  }, [nodeDataArray]);

  return (
    <>
      {isEditMode && (
        <>
          <div
            className="overflow-hidden pointer-events-none flex items-end justify-start fixed w-screen h-screen z-[999]">
            <div
              className="flex w-[230px] h-[95%] my-[2%] pt-5 rounded-xl bg-white shadow-[5px_5px_2px_0_rgba(0,0,0,0.7)] pointer-events-auto duration-300 transform -translate-x-[200px] hover:-translate-x-[20px]">
              <div className="w-[100%] h-[95%] pointer-events-auto" id='myPaletteDiv'>
                <canvas tabIndex={0} width="200" height="1900">
                  This text is displayed if your browser does not support the Canvas HTML element.
                </canvas>
              </div>
              <div id="slideIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="100%" viewBox="0 0 256 512">
                  <path
                    d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/>
                </svg>
              </div>
            </div>
          </div>
          <div
            className="absolute text-right w-screen px-5 py-2.5 h-[1px] z-10 select-none text-[rgba(255,255,255,0.3)] text-[5rem]">編輯模式
          </div>
        </>
      )}
      <div
        ref={divRef}
        style={{
          width: '100%',
          height: '100vh',
        }}
      />
    </>
  );

}

export default DiagramInitComponent