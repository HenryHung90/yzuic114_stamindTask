import {API_POST} from "./API_Config";
import {Req_tasksInfo} from "./API_Interface";

const API_initStudentTask = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_INIT_STUDENT_TASK || '', taskData).sendRequest()
}

export {API_initStudentTask}