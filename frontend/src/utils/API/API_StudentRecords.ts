import {Req_StudentRecordInfo} from "./API_Interface";
import {API_POST} from "./API_Config";
import {IStudentRecords} from "../listener/action";

const API_saveStudentRecords = (studentRecords: Array<IStudentRecords>) => {
  const recordData: Req_StudentRecordInfo = {
    student_records: studentRecords
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_STUDENT_RECORDS, recordData).sendRequest()
}

export {API_saveStudentRecords}