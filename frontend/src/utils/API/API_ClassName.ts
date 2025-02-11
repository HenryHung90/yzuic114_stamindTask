import {API_GET} from "./API_Config";

const API_getAllClassNames = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_ALL_CLASSNAMES || '').sendRequest()
}

export {API_getAllClassNames}