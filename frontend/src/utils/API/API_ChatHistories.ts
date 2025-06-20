import {Req_StudentChatHistory} from "./API_Interface";
import {API_POST} from "./API_Config";

export const API_getChatHistories = (offset: number, taskId: string) => {
  const chatData: Req_StudentChatHistory = {
    offset: offset,
    task_id: taskId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_HISTORIES, chatData).sendRequest()
}

export const API_getChatHistoriesByStudentId = (studentId: string) => {
  const chatData: Req_StudentChatHistory = {
    student_id: studentId
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_HISTORIES_BY_STUDENT_ID, chatData).sendRequest()
}

export const API_getChatAIHeatMapDataByTaskId = (taskId: string) => {
  const chatData: Req_StudentChatHistory = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_AI_HEATMAP_DATA_BY_TASK_ID, chatData).sendRequest()
}

export const API_getChatAIHeatMapDataByClassIds = (classIds: number[]) => {
  const chatData: Req_StudentChatHistory = {
    class_ids: classIds,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_AI_HEATMAP_DATA_BY_CLASS_IDS, chatData).sendRequest()
}