import {API_POST} from "./API_Config";
import {Req_ReflectionQuestionInfo} from "./API_Interface"
import {IReflection} from "../interface/Task";

const API_getReflectionQuestions = (taskId: string) => {
  const reflectionData: Req_ReflectionQuestionInfo = {
    task_id: taskId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_REFLECTION_QUESTIONS || '', reflectionData).sendRequest()
}

const API_saveReflectionQuestions = (taskId: string, selectNode: number, reflectionQuestions: Array<IReflection>) => {
  const reflectionData: Req_ReflectionQuestionInfo = {
    task_id: taskId,
    select_node: selectNode,
    questions: reflectionQuestions,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_REFLECTION_QUESTIONS || '', reflectionData).sendRequest()
}

export {API_getReflectionQuestions, API_saveReflectionQuestions}