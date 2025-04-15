import {Req_feedbackInfo} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getTeacherFeedback = (taskId: string, selectNode: number) => {
  const feedbackData: Req_feedbackInfo = {
    task_id: taskId,
    select_node: selectNode
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TEACHER_FEEDBACK || '', feedbackData).sendRequest()
}

const API_generateTeacherFeedback = (taskId: string, selectNode: number) => {
  const feedbackData: Req_feedbackInfo = {
    task_id: taskId,
    select_node: selectNode
  }
  return new API_POST(import.meta.env.VITE_APP_API_GENERATE_TEACHER_FEEDBACK || '', feedbackData).sendRequest()
}

export {API_getTeacherFeedback, API_generateTeacherFeedback}