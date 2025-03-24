import {API_POST} from "./API_Config";
import {Req_textBookInfo} from "./API_Interface";

const API_getTextBookFile = (taskId: string | undefined) => {
  const textBookData: Req_textBookInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TEXT_BOOK || '', textBookData).sendRequest()
}

const API_uploadTextBookFile = (taskId: string, file: File, selectNode: number) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('task_id', taskId)
  formData.append('select_node', selectNode.toString())
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_TEXT_BOOK || '', formData).sendRequest()
}

export {API_getTextBookFile, API_uploadTextBookFile}