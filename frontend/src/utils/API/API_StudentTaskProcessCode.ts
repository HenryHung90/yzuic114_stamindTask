import {API_POST} from "./API_Config";
import {Req_StudentTaskProcessCodeInfo} from "./API_Interface";

const API_getStudentTaskProcessCode = (taskId: string) => {
  const codeData: Req_StudentTaskProcessCodeInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_PROCESS_CODE, codeData).sendRequest()
}

const API_saveStudentTaskProcessCode = (taskId: string, htmlCode: string, cssCode: string, jsCode: string) => {
  const codeData: Req_StudentTaskProcessCodeInfo = {
    task_id: taskId,
    html_code: htmlCode,
    css_code: cssCode,
    js_code: jsCode
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_TASK_PROCESS_CODE, codeData).sendRequest()
}

export {API_getStudentTaskProcessCode, API_saveStudentTaskProcessCode}