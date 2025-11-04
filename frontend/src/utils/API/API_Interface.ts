import {Node, Link} from '../interface/diagram'
import {IReflection, IStudentReflection, ITaskPlan, ITaskProcessHint, ITaskSubTarget} from "../interface/Task";
import {IStudentRecords} from "../listener/action";
import {EGroupType} from "../functions/common";

// Request 訊息內容
export interface RequestParams {
  message?: string
}

// Response 訊息內容
export interface ResponseData {
  message: string
  data: any
  status: number
}

// API Extension ---------------------------------------------------------
// API Request Extension
export interface Req_login extends RequestParams {
  student_id: string
  password: string
}

export interface Req_register extends RequestParams {
  student_id: string
  user_type: 'STUDENT' | 'TEACHER'
  password: string
  name: string
  class_name: string
}

export interface Req_tasksInfo extends RequestParams {
  student_id?: string
  class_name?: string
  task_name?: string
  task_id?: string
  class_ids?: number[]
  node_array?: Array<Node>
  link_array?: Array<Link>
}

export interface Req_classNameInfo extends RequestParams {
  class_name: string
}

export interface Req_studentGroupInfo extends RequestParams {
  class_name: string
  change_group?: string
  student_id?: string
}

export interface Req_studentsInfo extends RequestParams {
  class_name: string
}

export interface Req_studentInfo extends RequestParams {
  student_id: string
  exchange_class_name?: string
  new_name?: string
  new_password?: string
}

export interface Req_registerStudentInfo extends RequestParams {
  student_id: string
  user_type: 'STUDENT' | 'TEACHER'
  password: string
  name: string
  class_name: string
}

export interface Req_experienceInfo extends RequestParams {
  task_id: string | undefined
}

export interface Req_targetInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  target_title?: string
  target_description?: string
  sub_target_list?: Array<ITaskSubTarget>
}

export interface Req_planInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  select_sub_list?: Array<boolean>
  plan_list?: Array<Array<ITaskPlan>>
}

export interface Req_textBookInfo extends RequestParams {
  task_id: string | undefined
}

export interface Req_processHintInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  process_hint_list?: Array<ITaskProcessHint>
}

export interface Req_studentNoteInfo extends RequestParams {
  student_notes: { [key: string]: any[] }
}

export interface Req_StudentTaskProcessCodeInfo extends RequestParams {
  task_id: string | undefined
  html_code?: string
  css_code?: string
  js_code?: string
}

export interface Req_StudentTaskProcessHintInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  process_hint_reply?: Array<string>
}

export interface Req_ReflectionQuestionInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  questions?: Array<IReflection>
}

export interface Req_StudentReflectionInfo extends RequestParams {
  task_id: string | undefined
  select_node?: number
  reflects?: Array<IStudentReflection>
  completed_targets?: Array<boolean>
  self_scoring?: number
}

export interface Req_StudentChatHistory extends RequestParams {
  task_id?: string
  class_ids?: number[]
  student_id?: string
  offset?: number
}

export interface Req_ChatWithAmumAmum extends RequestParams {
  task_id: string
  message: string
}

export interface Req_StudentRecordInfo extends RequestParams {
  student_id?: string
  task_id?: string
  class_ids?: number[]
  student_records?: Array<IStudentRecords>
}

export interface Req_feedbackInfo extends RequestParams {
  task_id?: string | undefined
  select_node?: number
  student_id?: string
}

export interface Req_graphragInfo extends RequestParams {
  task_id: string
}

// API Response Extension
// csrf cookie Response
export interface CSRF_cookies extends ResponseData {
  isAuthenticated: false | 'STUDENT' | 'TEACHER'
  user_type: false | 'STUDENT' | 'TEACHER'
  group_type: EGroupType
  name: string
  student_id: string
}

export interface Res_login extends ResponseData {
  name: string
  user_type: false | 'STUDENT' | 'TEACHER'
  student_id: string
  status: number
  group_type: EGroupType
}

export interface Res_tasksInfo extends ResponseData {
  id: number
  is_open?: boolean
  class_name?: string
  name: string
  created_at: string
  updated_at: string
}

export interface Res_classNamesInfo extends ResponseData {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface Res_studentsInfo extends ResponseData {
  id: number
  is_active: boolean
  class_name: string
  group_type: string
  student_id: string
  name: string
  created_at: string
  updated_at: string
}
