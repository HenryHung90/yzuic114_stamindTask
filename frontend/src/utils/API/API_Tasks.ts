import {Req_tasksInfo} from "./API_Interface";
import {API_GET, API_POST} from "./API_Config";
import {Node, Link} from '../interface/diagram'

// 學生取得屬於自己的課程
const API_getTasksInfo = (acc: string) => {
  const studentData: Req_tasksInfo = {
    message: 'tasks info',
    student_id: acc
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASKS_INFO || '', studentData).sendRequest()
}
//教師取得所有課程
const API_getAllTasksInfo = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_TASKS_INFO).sendRequest()
}

// get task by class name
const API_getTasksByClassName = (className: string) => {
  const studentData: Req_tasksInfo = {
    message: 'tasks info',
    class_name: className
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASKS_BY_CLASSNAME || '', studentData).sendRequest()
}

// add task
const API_addNewTask = (className: string, name: string) => {
  const taskData: Req_tasksInfo = {
    class_name: className,
    task_name: name
  }
  return new API_POST(import.meta.env.VITE_APP_API_ADD_NEW_TASK || '', taskData).sendRequest()
}

// get task Diagram
const API_getTaskDiagram = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_DIAGRAM || '', taskData).sendRequest()
}

// save task diagram
const API_saveTaskDiagram = (nodeArray: Array<Node>, linkArray: Array<Link>, taskId: string) => {
  const diagramData: Req_tasksInfo = {
    node_array: nodeArray,
    link_array: linkArray,
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_TASK_DIAGRAM || '', diagramData).sendRequest()
}

const API_switchTaskOpen = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId
  }
  return new API_GET(import.meta.env.VITE_APP_API_SWITCH_TASK_OPEN, taskData).sendRequest()
}

const API_changeTaskName = (taskId: string, taskName: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
    task_name: taskName
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHANGE_TASK_NAME, taskData).sendRequest()
}

export {
  API_getTasksInfo,
  API_getAllTasksInfo,
  API_getTasksByClassName,
  API_addNewTask,
  API_saveTaskDiagram,
  API_getTaskDiagram,
  API_switchTaskOpen,
  API_changeTaskName,
};