import {Req_login} from "./API_Interface";
import {API_GET, API_POST} from "./API_Config";

/**
 * 登入功能
 * @param acc{string} 登入帳號
 * @param psw{string} 登入密碼
 * @constructor
 */
const API_login = (acc: string, psw: string) => {
  const loginData: Req_login = {
    message: 'login request',
    student_id: acc,
    password: psw,
  }
  return new API_POST(import.meta.env.VITE_APP_API_LOGIN || '', loginData).sendLogin()
}
const API_logout = () => {
  return new API_GET(import.meta.env.VITE_APP_API_LOGOUT || '').sendRequest()
}

/**
 * 取得 User 的資料
 * @constructor
 */
const API_getUserInfo = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_USERINFO || '').sendRequest_sessionAndUserinfo()
}

export {API_login, API_logout, API_getUserInfo}