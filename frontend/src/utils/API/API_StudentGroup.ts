import {Req_classNameInfo} from "./API_Interface";
import {API_POST} from "./API_Config";

const API_getStudentGroupsByClassName = (className: string) => {
  const classData: Req_classNameInfo = {
    class_name: className
  }
  return new API_POST(import.meta.env.VITE_APP_API_GET_STUDENT_GROUPS_BY_CLASSNAME || '', classData).sendRequest()
}

export {API_getStudentGroupsByClassName}