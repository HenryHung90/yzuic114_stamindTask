import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog";
import {API_addStudent} from "../../../../API/API_Students";

function handlePromise(messageTitle: string, messageInfo: string, loading: ISettingAlertLogAndLoading) {
  loading.setAlertLog(messageTitle, messageInfo)
  loading.setLoadingOpen(false)
}

function handleAddNewStudent(loading: ISettingAlertLogAndLoading) {
  const className = prompt("請輸入年級")
  if (className === '' || className === null) return
  const studentId = prompt("請輸入學號")
  if (studentId === '' || studentId === null) return
  const name = prompt("請輸入姓名")
  if (name === '' || name === null) return
  const password = prompt("請輸入密碼")
  if (password === '' || password === null) return
  const userType = prompt("請輸入使用者類別(STUDENT or TEACHER)")
  if (userType === '' || userType === null) return

  if (userType === 'STUDENT' || userType === 'TEACHER') {
    API_addStudent(className, studentId, name, password, userType).then(response => {
      const messageInfo = "建立成功"
      handlePromise(response.message, messageInfo, loading)
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
  } else {
    loading.setAlertLog("錯誤", "user Type 只能是 STUDENT or TEACHER")
  }


}

function handleDownloadStudentList(loading: ISettingAlertLogAndLoading) {
  loading.setAlertLog("錯誤", "暫不支援")
}

function handleUploadStudentList(loading: ISettingAlertLogAndLoading) {
  loading.setAlertLog("錯誤", "暫不支援")
}

export {
  handleAddNewStudent,
  handleDownloadStudentList,
  handleUploadStudentList,
}