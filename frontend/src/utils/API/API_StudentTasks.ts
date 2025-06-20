import {API_POST, API_GET} from "./API_Config";
import {Req_tasksInfo} from "./API_Interface";

export const API_initStudentTask = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_INIT_STUDENT_TASK, taskData).sendRequest()
}

export const API_getStudentTaskByStudentId = (studentId: string) => {
  const taskData: Req_tasksInfo = {
    student_id: studentId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_BY_STUDENT_ID, taskData).sendRequest()
}

export const API_getStudentTaskByClassName = (className: string) => {
  const taskData: Req_tasksInfo = {
    class_name: className,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_BY_CLASS_NAME, taskData).sendRequest()
}

export const API_getStudentTaskByClassIds = (classIds: number[]) => {
  const taskData: Req_tasksInfo = {
    class_ids: classIds,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_BY_CLASS_IDS, taskData).sendRequest()
}

export const API_getAllStudentTasks = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_STUDENT_TASK).sendRequest()
}

export const API_getStudentTasksByTaskId = (taskId: string) => {
  const taskData: Req_tasksInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASKS_BY_TASK_ID, taskData).sendRequest()
}