import {API_GET, API_POST} from "./API_Config";
import {Req_experienceInfo} from "./API_Interface";


const API_getTaskExperience = (taskId: string | undefined) => {
  const experienceData: Req_experienceInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_EXPERIENCE || '', experienceData).sendRequest()
}

export {API_getTaskExperience}