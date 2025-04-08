import {Req_studentGroupInfo} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getStudentGroupsByClassName = (className: string) => {
  const groupData: Req_studentGroupInfo = {
    class_name: className
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_GROUPS_BY_CLASSNAME || '', groupData).sendRequest()
}

const API_updateStudentGroupByStudentId = (className: string, changeGroup: string, studentId: string) => {
  const groupData: Req_studentGroupInfo = {
    class_name: className,
    change_group: changeGroup,
    student_id: studentId,
  }
  return new API_POST(import.meta.env.VITE_APP_API_UPDATE_STUDENT_GROUP_BY_STUDENT_ID || '', groupData).sendRequest()
}

export {API_getStudentGroupsByClassName, API_updateStudentGroupByStudentId}