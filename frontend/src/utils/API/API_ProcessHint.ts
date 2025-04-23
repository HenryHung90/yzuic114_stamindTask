import {Req_processHintInfo} from "./API_Interface";
import {API_POST} from "./API_Config";
import {ITaskProcessHint} from "../interface/Task";

const API_getProcessHint = (taskId: string | undefined) => {
  const processHintData: Req_processHintInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_PROCESS_HINT, processHintData).sendRequest()
}

const API_uploadProcessHint = (taskId: string | undefined, selectNode: number, processHintList: Array<ITaskProcessHint>) => {
  const processHintData: Req_processHintInfo = {
    task_id: taskId,
    select_node: selectNode,
    process_hint_list: processHintList,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_PROCESS_HINT, processHintData).sendRequest()
}

export {API_getProcessHint, API_uploadProcessHint}