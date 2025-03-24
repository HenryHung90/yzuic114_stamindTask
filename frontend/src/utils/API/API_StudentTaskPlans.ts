import {API_POST} from "./API_Config";
import {ITaskPlan} from "../interface/Task";
import {Req_planInfo} from "./API_Interface";

const API_uploadTaskPlan = (taskId: string, selectNode: number, selectSubList: Array<boolean>, planList: Array<Array<ITaskPlan>>) => {
  const planData: Req_planInfo = {
    task_id: taskId,
    select_node: selectNode,
    select_sub_list: selectSubList,
    plan_list: planList,
  }
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_TASK_PLAN || '', planData).sendRequest()
}

const API_getTaskPlan = (taskId: string) => {
  const planData: Req_planInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_PLAN || '', planData).sendRequest()
}

export {API_uploadTaskPlan, API_getTaskPlan}