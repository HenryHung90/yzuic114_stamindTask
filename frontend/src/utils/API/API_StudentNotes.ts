import {API_GET, API_POST} from "./API_Config";
import {Req_studentNoteInfo} from "./API_Interface";

const API_getStudentNotes = () => {
  return new API_GET(import.meta.env.VITE_APP_API_GET_STUDENT_NOTE).sendRequest()
}

const API_saveStudentNotes = (notes: Array<any>) => {
  const notesData = {
    '0': notes
  }
  const noteData: Req_studentNoteInfo = {
    student_notes: notesData,
  }
  return new API_POST(import.meta.env.VITE_APP_API_SAVE_STUDENT_NOTE, noteData).sendRequest()
}

export {API_getStudentNotes, API_saveStudentNotes}