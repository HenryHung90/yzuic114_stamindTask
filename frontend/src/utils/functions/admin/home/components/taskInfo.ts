import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog"
import {API_getAllStudentProcessCodeByTaskId} from "../../../../API/API_StudentTaskProcess"
import {autoDownloadFile, convertToXlsxFile, handlePromise} from "../../../common"
import {API_getFeedbackByTaskId} from "../../../../API/API_Feedback";

function handleDownloadAllCodeByTaskId(loading: ISettingAlertLogAndLoading, taskId: string) {
  loading.setLoadingOpen(true)
  API_getAllStudentProcessCodeByTaskId(taskId).then(response => {
    const fileName = response.data.download_file
    const formatUrl = `${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/code_zip/${fileName}`
    setTimeout(() => {
      autoDownloadFile(formatUrl, 'student_task.zip')
      handlePromise('Message', response.message, loading, Function)
    }, 100)
  })
}

function handleDownloadAllFeedbackByTaskId(loading: ISettingAlertLogAndLoading, taskId: string) {
  loading.setLoadingOpen(true)
  API_getFeedbackByTaskId(taskId).then(response => {
    convertToXlsxFile(`student_feedback_${response.data.task_name}`, [response.data.task_name], [response.data.feedback])
    handlePromise('Message', response.message, loading, Function)
  })
}

export {handleDownloadAllCodeByTaskId, handleDownloadAllFeedbackByTaskId}