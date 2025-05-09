import {Req_ChatWithAmumAmum} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_chatWithAmumAmum = (message: string, taskId: string) =>{
  const amumamumData:Req_ChatWithAmumAmum = {
    task_id: taskId,
    message: message
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHAT_WITH_AMUMAMUM, amumamumData).sendRequest()
}

export {API_chatWithAmumAmum}