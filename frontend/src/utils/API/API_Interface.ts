import {Node, Link} from '../interface/diagram'
import {IReflection, IStudentReflection, ITaskPlan, ITaskSubTarget} from "../interface/Task";
import {IStudentRecords} from "../listener/action";

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
  student_id?: string
  class_name?: string
  task_name?: string
  task_id?: string
  node_array?: Array<Node>
  link_array?: Array<Link>
}

interface Req_classNameInfo extends RequestParams {
  class_name: string
}

interface Req_studentGroupInfo extends RequestParams {
  class_name: string
  change_group?: string
  student_id?: string
}

interface Req_studentsInfo extends RequestParams {
  class_name: string
}

interface Req_studentInfo extends RequestParams {
  student_id: string
  exchange_class_name?: string
  new_name?: string
  new_password?: string
}

interface Req_registerStudentInfo extends RequestParams {
  student_id: string
  user_type: 'STUDENT' | 'TEACHER'
  password: string
  name: string
  class_name: string
}

interface Req_experienceInfo extends RequestParams {
  task_id: string | undefined
}

interface Req_targetInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  target_title?: string
  target_description?: string
  sub_target_list?: Array<ITaskSubTarget>
}

interface Req_planInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  select_sub_list?: Array<boolean>
  plan_list?: Array<Array<ITaskPlan>>
}

interface Req_textBookInfo extends RequestParams {
  task_id: string | undefined
}

interface Req_studentNoteInfo extends RequestParams {
  student_notes: { [key: string]: any[] }
}

interface Req_StudentTaskProcessCodeInfo extends RequestParams {
  task_id: string | undefined
  html_code?: string
  css_code?: string
  js_code?: string
}

interface Req_ReflectionQuestionInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  questions?: Array<IReflection>
}

interface Req_StudentReflectionInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  reflects?: Array<IStudentReflection>
  completed_targets?: Array<boolean>
  self_scoring?: number
}

interface Req_StudentChatHistory extends RequestParams {
  offset: number
}

interface Req_ChatWithAmumAmum extends RequestParams {
  message: string
}

interface Req_StudentRecordInfo extends RequestParams {
  student_records: Array<IStudentRecords>
}

interface Req_feedbackInfo extends RequestParams {
  task_id: string | undefined
  select_node: number
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
  id: number
  is_open?: boolean
  class_name?: string
  name: string
  created_at: string
  updated_at: string
}

interface Res_classNamesInfo extends ResponseData {
  id: number
  name: string
  created_at: string
  updated_at: string
}

interface Res_studentsInfo extends ResponseData {
  id: number
  is_active: boolean
  class_name: string
  group_type: string
  student_id: string
  name: string
  created_at: string
  updated_at: string
}

export type{
  RequestParams,
  ResponseData,
  Req_login,
  Req_register,
  Req_tasksInfo,
  Req_classNameInfo,
  Req_studentGroupInfo,
  Req_studentsInfo,
  Req_studentInfo,
  Req_registerStudentInfo,
  Req_experienceInfo,
  Req_targetInfo,
  Req_planInfo,
  Req_textBookInfo,
  Req_studentNoteInfo,
  Req_StudentTaskProcessCodeInfo,
  Req_ReflectionQuestionInfo,
  Req_StudentReflectionInfo,
  Req_StudentChatHistory,
  Req_ChatWithAmumAmum,
  Req_StudentRecordInfo,
  Req_feedbackInfo,
  CSRF_cookies,
  Res_login,
  Res_tasksInfo,
  Res_classNamesInfo,
  Res_studentsInfo
}