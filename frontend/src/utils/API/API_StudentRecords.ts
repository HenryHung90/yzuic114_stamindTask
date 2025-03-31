import {Req_StudentRecordInfo} from "./API_Interface";
import {API_POST} from "./API_Config";
import {IStudentRecords} from "../listener/action";

const API_saveStudentRecords = (studentRecords: Array<IStudentRecords>) => {
  const recordData: Req_StudentRecordInfo = {
    student_records: studentRecords
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_STUDENT_RECORDS, recordData).sendRequest()
}

const API_saveStudentRecordsBeforeUnload = (studentRecords: FormData, e: any) => {
  if (studentRecords) {
    //使用 navigator.sendBeacon
    const success = navigator.sendBeacon(
      import.meta.env.VITE_APP_API_SAVE_STUDENT_RECORDS,
      studentRecords
    );

    // 如果 sendBeacon 不可用或失敗，可以顯示確認對話框
    if (!success) {
      // 這會顯示一個確認對話框，詢問用戶是否確定要離開
      e.preventDefault();
      e.returnValue = '您有未保存的數據，確定要離開嗎？';
    }
  }
}

export {API_saveStudentRecords, API_saveStudentRecordsBeforeUnload}