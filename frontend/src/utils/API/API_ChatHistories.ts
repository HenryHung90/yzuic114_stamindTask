import {Req_StudentChatHistory} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getChatHistories = (offset: number, taskId: string) => {
  const chatData: Req_StudentChatHistory = {
    offset: offset,
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_HISTORIES, chatData).sendRequest()
}

const API_getChatHistoriesByStudentId = (studentId: string) => {
  const chatData: Req_StudentChatHistory = {
    student_id: studentId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_HISTORIES_BY_STUDENT_ID, chatData).sendRequest()
}

export {API_getChatHistories, API_getChatHistoriesByStudentId}