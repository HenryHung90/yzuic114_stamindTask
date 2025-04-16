import {Req_StudentReflectionInfo} from "./API_Interface";
import {API_POST} from "./API_Config";
import {IStudentReflection} from "../interface/Task";

const API_getStudentTaskReflections = (taskId: string) => {
  const reflectionData: Req_StudentReflectionInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_TASK_REFLECTIONS, reflectionData).sendRequest()
}

const API_saveStudentTaskReflections = (taskId: string, selectNode: number, reflects: Array<IStudentReflection>, completedTargets: Array<boolean>, selfScoring: number) => {
  const reflectionData: Req_StudentReflectionInfo = {
    task_id: taskId,
    select_node: selectNode,
    reflects: reflects,
    completed_targets: completedTargets,
    self_scoring: selfScoring,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_STUDENT_TASK_REFLECTIONS, reflectionData).sendRequest()
}

export {API_getStudentTaskReflections, API_saveStudentTaskReflections}