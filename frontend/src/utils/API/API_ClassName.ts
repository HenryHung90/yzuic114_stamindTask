import {API_GET, API_POST} from "./API_Config";
import {Req_classNameInfo} from "./API_Interface";

const API_getAllClassNames = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_CLASSNAMES || '').sendRequest()
}

const API_addNewClassName = (className: string) => {
  const classData: Req_classNameInfo = {
    class_name: className
  }
  return new API_POST(import.meta.env.VITE_APP_API_ADD_NEW_CLASSNAME || '', classData).sendRequest()
}

export {API_getAllClassNames, API_addNewClassName}