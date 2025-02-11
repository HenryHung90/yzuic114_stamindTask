import {
  API_changeStudentClassName,
  API_changeStudentName,
  API_changeStudentPassword,
  API_switchStudentActive,
  API_switchStudentGroup
} from "../../../../API/API_Students";
import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog";
import {Res_classNamesInfo} from "../../../../API/API_Interface";

function handlePromise(messageTitle: string, messageInfo: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  loading.setAlertLog(messageTitle, messageInfo)
  loading.setLoadingOpen(false)
  fetchStudentListAsync()
}

function handleSwitchActive(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  loading.setLoadingOpen(true)
  API_switchStudentActive(studentId).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n是否啟用:${response.data.student_data.is_active ? '🟢' : '🔴'}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleSwitchGroup(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  loading.setLoadingOpen(true)
  API_switchStudentGroup(studentId).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n現在組別:${response.data.student_data.group_type}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeClassName(studentId: string, classList: Array<Res_classNamesInfo>, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  const studentClassName = prompt("要置換到哪一個班級？")

  if (studentClassName === '' || studentClassName === null) return
  if (!classList.some(classInfo => classInfo.name === studentClassName)) return alert("此班級不存在")

  loading.setLoadingOpen(true)
  API_changeStudentClassName(studentId, studentClassName).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n現在班級:${response.data.student_data.class_name},\n現在組別:${response.data.student_data.group_type}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeName(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  const studentNewName = prompt("請輸入欲更改成的名稱")

  if (studentNewName === '' || studentNewName === null) return

  loading.setLoadingOpen(true)
  API_changeStudentName(studentId, studentNewName).then(response => {
    const messageInfo = `學號:${response.data.student_data.student_id},\n新的名稱:${response.data.student_data.name}`
    handlePromise(response.message, messageInfo, loading, fetchStudentListAsync)
  })
}

function handleChangeStudentId(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
  loading.setAlertLog("錯誤", "暫不支援")
}

function handleChangePassword(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>) {
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

function handleDonwloadChatHistories(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>){
   loading.setAlertLog("錯誤", "暫不支援")
}

function handleDonwloadFeedback(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>){
   loading.setAlertLog("錯誤", "暫不支援")
}
function handleDonwloadStudentRecord(studentId: string, loading: ISettingAlertLogAndLoading, fetchStudentListAsync: () => Promise<void>){
   loading.setAlertLog("錯誤", "暫不支援")
}

export {
  handleSwitchActive,
  handleSwitchGroup,
  handleChangeClassName,
  handleChangeName,
  handleChangeStudentId,
  handleChangePassword,
  handleDonwloadChatHistories,
  handleDonwloadFeedback,
  handleDonwloadStudentRecord
}