import {API_POST, API_GET} from "./API_Config";
import {Req_tasksInfo} from "./API_Interface";

const API_initStudentTask = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_INIT_STUDENT_TASK, taskData).sendRequest()
}

const API_getStudentTaskByStudentId = (studentId: string) => {
  const taskData: Req_tasksInfo = {
    student_id: studentId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_BY_STUDENT_ID, taskData).sendRequest()
}

const API_getStudentTaskByClassName = (className: string) => {
  const taskData: Req_tasksInfo = {
    class_name: className,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_BY_CLASS_NAME, taskData).sendRequest()
}

const API_getAllStudentTasks = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_STUDENT_TASK).sendRequest()
}

export {API_initStudentTask, API_getStudentTaskByStudentId, API_getStudentTaskByClassName, API_getAllStudentTasks}