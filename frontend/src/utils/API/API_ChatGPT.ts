import {Req_ChatWithAmumAmum} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_chatWithAmumAmum = (message: string) =>{
  const amumamumData:Req_ChatWithAmumAmum = {
    message: message
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHAT_WITH_AMUMAMUM, amumamumData).sendRequest()
}

export {API_chatWithAmumAmum}