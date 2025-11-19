import {API_POST} from "./API_Config";
import {Req_graphragDetail, Req_graphragInfo} from "./API_Interface";

// upload GraphRag File by FormData
export const API_uploadGraphRagFile = (formData: FormData) => {
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_GRAPHRAG_FILE || '', formData).sendRequest()
}

// Get Full GraphRag Info
export const API_getGraphRagInfo = (taskId: string) => {
  const taskData: Req_graphragInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_GRAPHRAG_INFO || '', taskData).sendRequest()
}

// Get Rag info by type and id
export const API_getGraphRagDetailByTypeAndId = (taskId: string | undefined, type: string, id: string) => {
  const graphRagData: Req_graphragDetail = {
    task_id: taskId,
    type: type,
    id: id
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_GRAPHRAG_DETAIL_BY_TYPE_AND_ID || '', graphRagData).sendRequest()
}

