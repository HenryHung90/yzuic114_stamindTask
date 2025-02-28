import {API_POST} from "./API_Config"
import {Req_targetInfo} from "./API_Interface";
import {ITaskSubTarget} from "../interface/Task";

const API_getTaskTarget = (taskId: string) => {
  const targetData: Req_targetInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_TARGET || '', targetData).sendRequest()
}

const API_uploadTaskTarget = (taskId: string, selectNode: number, title: string, description: string, subTargets: Array<ITaskSubTarget>) => {
  const targetData: Req_targetInfo = {
    task_id: taskId,
    select_node: selectNode,
    target_title: title,
    target_description: description,
    sub_target_list: subTargets
  }
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_TASK_TARGET || '', targetData).sendRequest()
}


export {API_getTaskTarget, API_uploadTaskTarget}