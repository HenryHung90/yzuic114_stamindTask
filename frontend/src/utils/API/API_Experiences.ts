import {API_GET, API_POST} from "./API_Config";
import {Req_experienceInfo} from "./API_Interface";


const API_getTaskExperience = (taskId: string | undefined) => {
  const experienceData: Req_experienceInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_TASK_EXPERIENCE || '', experienceData).sendRequest()
}

const API_uploadTaskExperienceFile = (taskId: string, file: File, selectNode: number) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('task_id', taskId)
  formData.append('select_node',selectNode.toString())
  return new API_POST(import.meta.env.VITE_APP_API_UPLOAD_EXPERIENCE_FILE || '', formData).sendRequest()
}

export {API_getTaskExperience, API_uploadTaskExperienceFile}