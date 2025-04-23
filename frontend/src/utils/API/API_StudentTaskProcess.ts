import {API_POST} from "./API_Config";
import {Req_StudentTaskProcessCodeInfo, Req_StudentTaskProcessHintInfo} from "./API_Interface";

const API_getStudentTaskProcessCode = (taskId: string) => {
  const codeData: Req_StudentTaskProcessCodeInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_PROCESS_CODE, codeData).sendRequest()
}

const API_saveStudentTaskProcessCode = (taskId: string, htmlCode: string, cssCode: string, jsCode: string) => {
  const codeData: Req_StudentTaskProcessCodeInfo = {
    task_id: taskId,
    html_code: htmlCode,
    css_code: cssCode,
    js_code: jsCode
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_STUDENT_PROCESS_CODE, codeData).sendRequest()
}

const API_getProcessHintReply = (taskId: string) => {
  const processHintData: Req_StudentTaskProcessHintInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_PROCESS_HINT_REPLY, processHintData).sendRequest()
}

const API_saveProcessHintReply = (taskId: string, selectNode: number, processHintReply: Array<string>) => {
  const processHintData: Req_StudentTaskProcessHintInfo = {
    task_id: taskId,
    select_node: selectNode,
    process_hint_reply: processHintReply
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_PROCESS_HINT_REPLY, processHintData).sendRequest()
}

export {
  API_getStudentTaskProcessCode,
  API_saveStudentTaskProcessCode,
  API_getProcessHintReply,
  API_saveProcessHintReply
}