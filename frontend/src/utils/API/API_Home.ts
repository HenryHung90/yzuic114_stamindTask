import {Req_tasksInfo} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getTasksInfo = (acc: string) => {
  const studentData: Req_tasksInfo = {
    message: 'tasks info',
    student_id: acc
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASKS_INFO || '', studentData).sendRequest()
}

export {API_getTasksInfo}