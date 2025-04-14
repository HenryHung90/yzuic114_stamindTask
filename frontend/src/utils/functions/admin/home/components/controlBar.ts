import React from "react"
import * as XLSX from 'xlsx'
// style
// API
import {API_addNewTask} from "../../../../API/API_Tasks";
import {Res_classNamesInfo} from "../../../../API/API_Interface";
import {API_addNewClassName} from "../../../../API/API_ClassName";
import {
  API_addStudent,
  API_getAllStudents,
  API_multiStudentUpload
} from "../../../../API/API_Students";
// components
// interface
import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog";

function handlePromise(messageTitle: string, messageInfo: string, loading: ISettingAlertLogAndLoading) {
  loading.setAlertLog(messageTitle, messageInfo)
  loading.setLoadingOpen(false)
}

function handleAddNewStudent(loading: ISettingAlertLogAndLoading) {
  const className = prompt("請輸入年級")
  if (className === '' || className === null) return
  const studentId = prompt("請輸入學號")
  if (studentId === '' || studentId === null) return
  const password = prompt("請輸入密碼")
  if (password === '' || password === null) return
  const name = prompt("請輸入姓名")
  if (name === '' || name === null) return
  const userType = prompt("請輸入使用者類別(STUDENT or TEACHER)")
  if (userType === '' || userType === null) return

  if (userType === 'STUDENT' || userType === 'TEACHER') {
    API_addStudent(className, studentId, name, password, userType).then(response => {
      const messageInfo = response.status === 200 ? "建立成功" : "建立失敗"
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
  loading.setLoadingOpen(true)
  API_getAllStudents().then(response => {
    const studentData = response.data.students_data
    // 將數據轉換為工作表
    const worksheet = XLSX.utils.json_to_sheet(studentData);

    // 創建工作簿並添加工作表
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // 將工作簿轉換為二進制數據
    const workbookBinary = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    // 創建 Blob 對象
    const blob = new Blob([workbookBinary], {type: 'application/octet-stream'});

    // 創建下載鏈接並觸發下載
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    loading.setLoadingOpen(false)
  })
}

function handleUploadStudentList(event: React.ChangeEvent<HTMLInputElement>, fileInputRef: React.RefObject<HTMLInputElement>, loading: ISettingAlertLogAndLoading) {
  const file = event.target.files?.[0];
  if (!file) return;

  loading.setLoadingOpen(true);
  API_multiStudentUpload(file).then(response => {
    if (response.status == 200) loading.setAlertLog('success', '成功')
    // 清空文件選擇框的值
    if (fileInputRef.current) fileInputRef.current.value = "";
    loading.setLoadingOpen(false);
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  })
}

// For classManagement
function handleAddNewTask(classList: Array<Res_classNamesInfo>, loading: ISettingAlertLogAndLoading) {
  const className = prompt("請輸入年級")
  if (className === '' || className === null) return
  if (!classList.some(classInfo => classInfo.name === className)) return handlePromise("錯誤", "此班級不存在", loading)
  const taskName = prompt("請輸入課程名稱")
  if (taskName === '' || taskName === null) return

  API_addNewTask(className, taskName).then(response => {
    const messageInfo = "建立成功"
    handlePromise(response.message, messageInfo, loading)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  })
}

// For groupManagement
function handleAddNewGroup(classList: Array<Res_classNamesInfo>, loading: ISettingAlertLogAndLoading) {
  const className = prompt("請輸入欲新增的年級")
  if (className === '' || className === null) return
  if (classList.some(classInfo => classInfo.name === className)) return handlePromise("錯誤", "此班級已存在", loading)

  API_addNewClassName(className).then(response => {
    const messageInfo = "建立成功"
    handlePromise(response.message, messageInfo, loading)
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  })
}

export {
  handleAddNewStudent,
  handleDownloadStudentList,
  handleUploadStudentList,
  handleAddNewTask,
  handleAddNewGroup
}