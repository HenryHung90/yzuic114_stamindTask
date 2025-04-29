import {
  API_changeStudentClassName,
  API_changeStudentName,
  API_changeStudentPassword,
  API_switchStudentActive,
  API_switchStudentGroup
} from "../../../../API/API_Students"
import {API_getChatHistoriesByStudentId} from "../../../../API/API_ChatHistories"
import {API_getFeedbackByStudentId} from "../../../../API/API_Feedback"
import {API_getStudentRecordByStudentId} from "../../../../API/API_StudentRecords"
import {API_getStudentTaskByStudentId} from '../../../../API/API_StudentTasks'
import {convertToXlsxFile, handlePromise} from "../../../common"
import {IStudentListFuncProps} from "../../../../interface/adminManage";


function handleSwitchActive(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading} = props
  loading.setLoadingOpen(true)
  API_switchStudentActive(studentId).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n是否啟用:${response.data.student_data.is_active ? '🟢' : '🔴'}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleSwitchGroup(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading} = props
  loading.setLoadingOpen(true)
  API_switchStudentGroup(studentId).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n現在組別:${response.data.student_data.group_type}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeClassName(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading, classList} = props
  const studentClassName = prompt("要置換到哪一個班級？")

  if (studentClassName === '' || studentClassName === null) return
  if (classList && !classList.some(classInfo => classInfo.name === studentClassName)) return alert("此班級不存在")

  loading.setLoadingOpen(true)
  API_changeStudentClassName(studentId, studentClassName).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n現在班級:${response.data.student_data.class_name},\n現在組別:${response.data.student_data.group_type}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeName(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading} = props
  const studentNewName = prompt("請輸入欲更改成的名稱")

  if (studentNewName === '' || studentNewName === null) return

  loading.setLoadingOpen(true)
  API_changeStudentName(studentId, studentNewName).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n新的名稱:${response.data.student_data.name}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeStudentId(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading} = props
  loading.setAlertLog("錯誤", "暫不支援")
}

function handleChangePassword(props: IStudentListFuncProps) {
  const {studentId, fetchStudentListAsync, loading} = props
  const studentNewPassword = prompt("請輸入新密碼")
  if (studentNewPassword === '' || studentNewPassword === null) return
  const confirmNewPassword = prompt("再次輸入密碼")
  if (studentNewPassword !== confirmNewPassword) return alert("兩次密碼不一")

  loading.setLoadingOpen(true)
  API_changeStudentPassword(studentId, studentNewPassword).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n已更改`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleDownloadChatHistories(props: IStudentListFuncProps) {
  const {studentId, loading} = props
  loading.setLoadingOpen(true)
  API_getChatHistoriesByStudentId(studentId).then(response => {
    convertToXlsxFile(`${studentId}_chat_histories.xlsx`, [studentId], [response.data.chat_history])
    loading.setLoadingOpen(false)
  })
}

function handleDownloadFeedback(props: IStudentListFuncProps) {
  const {studentId, loading} = props
  loading.setLoadingOpen(true)
  API_getFeedbackByStudentId(studentId).then(response => {
    convertToXlsxFile(`${studentId}_feedback.xlsx`, [studentId], [response.data.feedback])
    loading.setLoadingOpen(false)
  })
}

function handleDownloadStudentRecord(props: IStudentListFuncProps) {
  const {studentId, loading} = props
  loading.setLoadingOpen(true)
  API_getStudentRecordByStudentId(studentId).then(response => {
    convertToXlsxFile(`${studentId}_record.xlsx`, [studentId], [response.data.student_record])
    loading.setLoadingOpen(false)
  })
}

function handleDownloadAllStudentTaskContent(props: IStudentListFuncProps) {
  const {studentId, loading} = props
  loading.setLoadingOpen(true)
  API_getStudentTaskByStudentId(studentId).then(response => {
    convertToXlsxFile(`${studentId}_student_task_content.xlsx`, [studentId], [response.data.student_task_content])
    loading.setLoadingOpen(false)
  })
}

export {
  handleSwitchActive,
  handleSwitchGroup,
  handleChangeClassName,
  handleChangeName,
  handleChangeStudentId,
  handleChangePassword,
  handleDownloadChatHistories,
  handleDownloadFeedback,
  handleDownloadStudentRecord,
  handleDownloadAllStudentTaskContent
}