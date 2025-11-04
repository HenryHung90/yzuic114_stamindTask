import {API_POST} from "./API_Config";
import {Req_graphragInfo} from "./API_Interface";

export const API_uploadGraphRagFile = (formData: FormData) => {
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_GRAPHRAG_FILE || '', formData).sendRequest()
}

export const API_getGraphRagInfo = (taskId: string) => {
  const taskData: Req_graphragInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_GRAPHRAG_INFO || '', taskData).sendRequest()
}
