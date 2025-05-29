import React from "react"
// style
// API
import {API_addNewTask} from "../../../../API/API_Tasks";
import {API_addNewClassName} from "../../../../API/API_ClassName";
import {
  API_addStudent,
  API_getAllStudents,
  API_multiStudentUpload
} from "../../../../API/API_Students";
import {
  API_getStudentTaskByClassName,
  API_getStudentTaskByStudentId,
  API_getAllStudentTasks
} from "../../../../API/API_StudentTasks";
import {API_getAllStudentRecord} from "../../../../API/API_StudentRecords";
import {convertToXlsxFile} from "../../../common";
// components
// interface
import {Res_classNamesInfo, Res_studentsInfo} from "../../../../API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog";

function handlePromise(messageTitle: string, messageInfo: string, loading: ISettingAlertLogAndLoading) {
  loading.setAlertLog(messageTitle, messageInfo)
  loading.setLoadingOpen(false)
}


// For StudentManagement
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
    convertToXlsxFile('student_list', ['students'], [response.data.students_data])
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

function handleDownloadAllStudentTask(loading: ISettingAlertLogAndLoading) {
  loading.setLoadingOpen(true)
  API_getAllStudentTasks().then(response => {
    convertToXlsxFile(`all_student_task_content.xlsx`, response.data.student_id_list, response.data.student_data_list)
    loading.setLoadingOpen(false)
  })
}

function handleDownloadStudentTaskByClassName(loading: ISettingAlertLogAndLoading, classList: Array<Res_classNamesInfo>) {
  const className = prompt("請輸入欲下載年級")
  if (className === '' || className === null) return

  if (classList.some(value => value.name === className)) {
    loading.setLoadingOpen(true)
    API_getStudentTaskByClassName(className).then(response => {
      convertToXlsxFile(`${className}_student_task_content`, response.data.student_id_list, response.data.student_data_list)
      loading.setLoadingOpen(false)
    })
  } else {
    alert("該年級不存在")
  }
}

function handleDownloadStudentTaskByStudentId(loading: ISettingAlertLogAndLoading, studentList: Array<Res_studentsInfo>) {
  const studentId = prompt("請輸入欲下載學生學號")
  if (studentId === '' || studentId === null) return

  if (studentList.some(value => value.student_id === studentId)) {
    loading.setLoadingOpen(true)
    API_getStudentTaskByStudentId(studentId).then(response => {
      convertToXlsxFile(`${studentId}_student_task_content`, [studentId], [response.data.student_task_content])
      loading.setLoadingOpen(false)
    })
  } else {
    alert("該學生不存在")
  }
}

function handleDownloadAllStudentRecords(loading: ISettingAlertLogAndLoading) {
  loading.setLoadingOpen(true)
  API_getAllStudentRecord().then(response => {
    convertToXlsxFile(`all_student_record_content`, response.data.student_id_list, response.data.student_data_list)
    loading.setLoadingOpen(false)
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
  handleDownloadStudentTaskByClassName,
  handleDownloadStudentTaskByStudentId,
  handleDownloadAllStudentTask,
  handleDownloadAllStudentRecords,
  handleAddNewTask,
  handleAddNewGroup,
}