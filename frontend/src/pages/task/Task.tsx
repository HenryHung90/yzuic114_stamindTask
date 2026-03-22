import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import * as go from "gojs";
// style

// API
import {API_getTaskDiagram} from "../../utils/API/API_Tasks";
import {API_initStudentTask} from "../../utils/API/API_StudentTasks";
import {handleCustomRecord} from "../../utils/listener/action";

// components
import DiagramInitComponent from "../../components/Diagram/DiagramInit";
import TaskContentComponent from "./components/TaskContent";
import SpeedDialComponent from "../../components/SpeedDial/SpeedDial";

// interface
import {ITaskProps} from "../../utils/interface/Task";

import {Link, Node} from "../../utils/interface/diagram";
import {calculateTimer} from "../../utils/functions/common";


const Task = (props: ITaskProps) => {
  const {name, studentId, groupType, setTempStudentRecords, settingAlertLogAndLoading} = props;
  const {taskId} = useParams();

  const divRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<go.Diagram | null>(null)

  const setDiagramRef = (diagram: go.Diagram | null) => {
    diagramRef.current = diagram;
  };

  const [nodes, setNodes] = useState<Array<Node>>([])
  const [links, setLinks] = useState<Array<Link>>([])

  const [selectNode, setSelectNode] = useState<{ key: number, category: string, text: string }>({
    key: 0,
    category: '',
    text: ''
  })

  // 初始進入需做的
  useEffect(() => {
    // 取得 Task 的 Diagram
    const fetchTaskDiagram = () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskDiagram(taskId || '').then(response => {
        setNodes(response.data.nodes_data)
        setLinks(response.data.links_data)
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }
    // Init Student Task 建置該份 Student Task
    const initStudentTask = () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_initStudentTask(taskId || '').then(response => {
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }

    fetchTaskDiagram()
    initStudentTask()
  }, []);

  // 檢測進入各階段 紀錄時間行為（特殊處理）
  const [startTime, setStartTime] = useState<number>(0)
  const [recordCategory, setRecordCategory] = useState<string>("")
  useEffect(() => {
    if (selectNode.category) {
      setStartTime(Date.now())
      setRecordCategory(selectNode.category)
      handleCustomRecord({
        action: 'click',
        type: 'taskNode',
        object: `enter${selectNode.category}_階段${selectNode.key}`,
        id: `task_enter${selectNode.category}`
      }, false, studentId || '', setTempStudentRecords)
    } else if (recordCategory) {
      const timer = calculateTimer(startTime)
      handleCustomRecord({
        action: 'click',
        type: 'button',
        timer: timer,
        object: `leave${recordCategory}_階段${selectNode.key}`,
        id: `task_leave${recordCategory}`
      }, false, studentId || '', setTempStudentRecords)
      setStartTime(0)
      setRecordCategory("")
    }
  }, [selectNode]);

  return (
    <div>
      <TaskContentComponent
        taskId={taskId}
        studentId={studentId}
        groupType={groupType}
        selectNode={selectNode}
        setSelectNode={setSelectNode}
        setTempStudentRecords={setTempStudentRecords}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <SpeedDialComponent taskId={taskId || '0'} name={name || ''} studentId={studentId} selectNode={selectNode}/>
      <DiagramInitComponent
        divRef={divRef}
        diagramRef={diagramRef}
        groupType={groupType}
        setDiagramRef={setDiagramRef}
        setSelectNode={setSelectNode}
        nodeDataArray={nodes}
        linkDataArray={links}
        isEditMode={false}
      />
    </div>
  )
}

export default Task