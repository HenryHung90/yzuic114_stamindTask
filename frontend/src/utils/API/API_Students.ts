import {API_POST, API_GET} from "./API_Config";
import {Req_studentInfo, Req_studentsInfo, Req_registerStudentInfo} from "./API_Interface";

const API_getStudentsByClassName = (className: string) => {
  const classNameData: Req_studentsInfo = {
    class_name: className,
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENTS_BY_CLASSNAME || '', classNameData).sendRequest()
}

const API_getAllStudents = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_STUDENTS || '').sendRequest()
}

const API_switchStudentActive = (studentId: string) => {
  const studentData: Req_studentInfo = {
    student_id: studentId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SWITCH_STUDENT_ACTIVE || '', studentData).sendRequest()
}

const API_switchStudentGroup = (studentId: string) => {
  const studentData: Req_studentInfo = {
    student_id: studentId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SWITCH_STUDENT_GROUP || '', studentData).sendRequest()
}

const API_changeStudentClassName = (studentId: string, className: string) => {
  const studentData: Req_studentInfo = {
    student_id: studentId,
    exchange_class_name: className,
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHANGE_STUDENT_CLASS_NAME || '', studentData).sendRequest()
}

const API_changeStudentName = (studentId: string, newName: string) => {
  const studentData: Req_studentInfo = {
    student_id: studentId,
    new_name: newName,
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHANGE_STUDENT_NAME || '', studentData).sendRequest()
}

const API_changeStudentPassword = (studentId: string, newPassword: string) => {
  const studentData: Req_studentInfo = {
    student_id: studentId,
    new_password: newPassword
  }
  return new API_POST(import.meta.env.VITE_APP_API_CHANGE_STUDENT_PASSWORD || '', studentData).sendRequest()
}

const API_addStudent = (className: string, studentId: string, name: string, password: string, userType: 'STUDENT' | 'TEACHER') => {
  const studentData: Req_registerStudentInfo = {
    class_name: className,
    student_id: studentId,
    name: name,
    password: password,
    user_type: userType
  }
  return new API_POST(import.meta.env.VITE_APP_API_REGISTER || '', studentData).sendRequest()
}

export {
  API_getStudentsByClassName,
  API_getAllStudents,
  API_switchStudentActive,
  API_switchStudentGroup,
  API_changeStudentClassName,
  API_changeStudentName,
  API_changeStudentPassword,
  API_addStudent
}