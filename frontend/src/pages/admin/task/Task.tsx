import React, {useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import * as go from "gojs";
// style

// API

// components
import DiagramInitComponent from "../../../components/Diagram/DiagramInit";
import DiagramControlComponent from "../../../components/Diagram/DiagramControl";

// interface
import {Node, Link} from '../../../utils/interface/diagram'

interface ITaskProps {
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {ISettingAlertLogAndLoading} from "../../../utils/interface/alertLog";
import {API_getTaskDiagram} from "../../../utils/API/API_Tasks";

const AdminTask = (props: ITaskProps) => {
  const {settingAlertLogAndLoading} = props
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
      <DiagramControlComponent
        taskId={taskId}
        diagramRef={diagramRef}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <DiagramInitComponent
        divRef={divRef}
        diagramRef={diagramRef}
        setDiagramRef={setDiagramRef}
        setSelectNode={setSelectNode}
        nodeDataArray={nodes}
        linkDataArray={links}
        isEditMode={true}
      />
    </div>
  )
}

export default AdminTask
export type {Link, Node}