import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import * as go from "gojs";
// style

// API
import {API_getTaskDiagram} from "../../utils/API/API_Tasks";
import {API_initStudentTask} from "../../utils/API/API_StudentTasks";

// components
import DiagramInitComponent from "../../components/Diagram/DiagramInit";
import TaskContentComponent from "./components/TaskContent";
import SpeedDialComponent from "../../components/SpeedDial/SpeedDial";

// interface
import {ITaskProps} from "../../utils/interface/Task";

import {Link, Node} from "../../utils/interface/diagram";


const Task = (props: ITaskProps) => {
  const {name, studentId, settingAlertLogAndLoading} = props;
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
    const fetchTaskDiagram = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskDiagram(taskId || '').then(response => {
        setNodes(response.data.nodes_data)
        setLinks(response.data.links_data)
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }
    // Init Student Task 建置該份 Student Task
    const initStudentTask = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_initStudentTask(taskId || '').then(response => {
        settingAlertLogAndLoading.setLoadingOpen(false)
        console.log(response.data.status)
      })
    }

    fetchTaskDiagram()
    initStudentTask()
  }, []);

  return (
    <div>
      <SpeedDialComponent name={name || ''} studentId={studentId} selectNode={selectNode}/>
      <TaskContentComponent
        taskId={taskId}
        selectNode={selectNode}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <DiagramInitComponent
        divRef={divRef}
        diagramRef={diagramRef}
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