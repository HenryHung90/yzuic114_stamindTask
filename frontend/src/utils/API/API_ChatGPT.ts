import {Req_ChatWithAmumAmum} from "./API_Interface";
import {API_POST} from "./API_Config";

export const API_chatWithAmumAmum = (message: string, taskId: string) => {
  const amumamumData:Req_ChatWithAmumAmum = {
    task_id: taskId,
    message: message
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHAT_WITH_AMUMAMUM, amumamumData).sendRequest()
}

export const API_specifyChatWithAmumAmum = (message: string, taskId: string, functionType: 'code_debug' | 'deep_learn' | 'similar' | 'next_step', findPrev?: boolean) => {
  const amumamumData: Req_ChatWithAmumAmum = {
    task_id: taskId,
    message: message,
    function_type: functionType,
    find_prev: findPrev
  }
  return new API_POST(import.meta.env.VITE_APP_API_SPECIFY_CHAT_WITH_AMUMAMUM, amumamumData).sendRequest()
}
