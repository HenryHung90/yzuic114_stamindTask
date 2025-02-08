// Request 訊息內容
interface RequestParams {
  message?: string
}

// Response 訊息內容
interface ResponseData {
  message: string
  data: any
  status: number
}

// API Extension ---------------------------------------------------------
// API Request Extension
interface Req_login extends RequestParams {
  student_id: string
  password: string
}

interface Req_register extends RequestParams {
  student_id: string
  user_type: 'STUDENT' | 'TEACHER'
  password: string
  name: string
  class_name: string
}

interface Req_tasksInfo extends RequestParams {
  student_id: string
}


// API Response Extension
// csrf cookie Response
interface CSRF_cookies extends ResponseData {
  isAuthenticated: false | 'STUDENT' | 'TEACHER'
  user_type: false | 'STUDENT' | 'TEACHER'
  name: string
  student_id: string
}

interface Res_login extends ResponseData {
  name: string
  user_type: false | 'STUDENT' | 'TEACHER'
  student_id: string
  status: number
}

interface Res_tasksInfo extends ResponseData {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}


export type{
  RequestParams, ResponseData,
  Req_login, Req_register, Req_tasksInfo,
  CSRF_cookies, Res_login, Res_tasksInfo
}