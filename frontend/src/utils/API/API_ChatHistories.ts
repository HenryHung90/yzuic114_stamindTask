import {Req_StudentChatHistory} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getChatHistories = (offset: number) => {
  const chatData: Req_StudentChatHistory = {
    offset: offset
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_CHAT_HISTORIES, chatData).sendRequest()
}

export {API_getChatHistories}