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

const API_getFeedbackByStudentId = (studentId: string) => {
  const feedbackData: Req_feedbackInfo = {
    student_id: studentId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_FEEDBACK_BY_STUDENT_ID, feedbackData).sendRequest()
}

const API_getFeedbackByTaskId = (taskId: string) => {
  const feedbackData: Req_feedbackInfo = {
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_FEEDBACK_BY_TASK_ID, feedbackData).sendRequest()
}

export {API_getTeacherFeedback, API_generateTeacherFeedback, API_getFeedbackByStudentId, API_getFeedbackByTaskId}