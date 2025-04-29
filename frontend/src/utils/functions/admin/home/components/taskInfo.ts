import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog"
import {API_getAllStudentProcessCodeByTaskId} from "../../../../API/API_StudentTaskProcess"
import {autoDownloadFile, handlePromise} from "../../../common"

function handleDownloadAllCodeByTaskId(loading: ISettingAlertLogAndLoading, taskId: string) {
  loading.setLoadingOpen(true)
  API_getAllStudentProcessCodeByTaskId(taskId).then(response => {
    const fileName = response.data.download_file
    const formatUrl = `/${import.meta.env.VITE_APP_FILE_ROUTE}/process_code_zip/${fileName}`
    setTimeout(() => {
      autoDownloadFile(formatUrl, 'student_task.zip')
      handlePromise('Message', response.message, loading, Function)
    }, 100)
  })
}

export {handleDownloadAllCodeByTaskId}