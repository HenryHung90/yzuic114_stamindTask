import {Req_tasksInfo} from "./API_Interface";
import {API_GET, API_POST} from "./API_Config";

// 學生取得屬於自己的課程
const API_getTasksInfo = (acc: string) => {
  const studentData: Req_tasksInfo = {
    message: 'tasks info',
    student_id: acc
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASKS_INFO || '', studentData).sendRequest()
}

//教師取得所有課程
const API_getAllTasksInfo = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_TASKS_INFO || '').sendRequest()
}

export {API_getTasksInfo, API_getAllTasksInfo}