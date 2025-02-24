import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import * as go from "gojs";
// style

// API

// components
import DiagramInitComponent from "../../components/Diagram/DiagramInit";
import {Link, Node} from "../../utils/interface/diagram";
import {API_getTaskDiagram} from "../../utils/API/API_Tasks";
import {ISettingAlertLogAndLoading} from "../../utils/interface/alertLog";

// interface
interface ITaskProps {
  studentId: string;
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}


const Task = (props: ITaskProps) => {
  const {studentId, settingAlertLogAndLoading} = props;
  const {taskId} = useParams();

  const divRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<go.Diagram | null>(null)

  const setDiagramRef = (diagram: go.Diagram | null) => {
    diagramRef.current = diagram;
  };

  const [nodes, setNodes] = useState<Array<Node>>([]);
  const [links, setLinks] = useState<Array<Link>>([]);

  useEffect(() => {
    const fetchTaskDiagram = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskDiagram(taskId || '').then(response => {
        setNodes(response.data.nodes_data)
        setLinks(response.data.links_data)
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }
    fetchTaskDiagram()
  }, []);

  return (
    <div>
      <DiagramInitComponent
        divRef={divRef}
        diagramRef={diagramRef}
        setDiagramRef={setDiagramRef}
        nodeDataArray={nodes}
        linkDataArray={links}
        isEditMode={false}
      />
    </div>
  )
}

export default Task