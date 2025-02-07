// Request 訊息內容
interface RequestParams {
  message?: string
}

// Response 訊息內容
interface ResponseData {
  message: string
  status: number
}

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

// API Extension ---------------------------------------------------------
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


export type{RequestParams, ResponseData, CSRF_cookies, Req_login, Res_login, Req_register}