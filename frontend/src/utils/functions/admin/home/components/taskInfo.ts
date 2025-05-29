import React from "react";
import {ISettingAlertLogAndLoading} from "../../../../interface/alertLog"
import {API_getAllStudentProcessCodeByTaskId} from "../../../../API/API_StudentTaskProcess"
import {autoDownloadFile, convertToXlsxFile, handlePromise, autoScreenShot} from "../../../common"
import {API_getFeedbackByTaskId} from "../../../../API/API_Feedback";

export function handleDownloadAllCodeByTaskId(loading: ISettingAlertLogAndLoading, taskId: string) {
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

export function handleDownloadAllFeedbackByTaskId(loading: ISettingAlertLogAndLoading, taskId: string) {
  loading.setLoadingOpen(true)
  API_getFeedbackByTaskId(taskId).then(response => {
    convertToXlsxFile(`student_feedback_${response.data.task_name}`, [response.data.task_name], [response.data.feedback])
    handlePromise('Message', response.message, loading, Function)
  })
}

export async function handleDownloadChartsScreenShot(loading: ISettingAlertLogAndLoading, chartsRef: React.RefObject<HTMLDivElement>) {
  if (chartsRef.current) {
    loading.setLoadingOpen(true)
    await autoScreenShot(chartsRef.current, 'charts-dashboard').then(response => {
      loading.setLoadingOpen(false)
    })
  }
}

export function calculateCompletedNumbers(studentTaskDataList: Array<Array<{ [key: string]: string }>>) {
  let experimentalCompleted: number = 0
  let experimentalNotCompleted: number = 0
  let controlCompleted: number = 0
  let controlNotCompleted: number = 0

  for (const taskData of studentTaskDataList) {
    // 計算完成人數
    const taskInfo = taskData[0]
    if (taskInfo['反饋內容'] !== "[]") {
      taskInfo['學生組別'] === 'EXPERIMENTAL' ? experimentalCompleted++ : controlCompleted++
    } else {
      taskInfo['學生組別'] === 'EXPERIMENTAL' ? experimentalNotCompleted++ : controlNotCompleted++
    }
  }
  return {
    '實驗組-完成': experimentalCompleted,
    '實驗組-未完成': experimentalNotCompleted,
    '操作組-完成': controlCompleted,
    '操作組-未完成': controlNotCompleted
  }
}

export function calculateSelfScoringData(studentTaskDataList: Array<Array<{ [key: string]: string }>>) {
  // 計算中位數
  function calculateMedian(sortedArray: Array<number>) {
    const mid = Math.floor(sortedArray.length / 2);

    if (sortedArray.length % 2 === 0) {
      // 偶數個元素，取中間兩個數的平均值
      return (sortedArray[mid - 1] + sortedArray[mid]) / 2;
    } else {
      // 奇數個元素，直接取中間值
      return sortedArray[mid];
    }
  }

  let selfScoring: Array<number> = []
  for (const taskData of studentTaskDataList) {
    // 計算箱型圖數
    const scoring = JSON.parse(taskData[0]['自我評分'])[0] ?? 0
    selfScoring.push(scoring)
  }
  const sortedScores = [...selfScoring].sort((a, b) => a - b)
  const lowerHalf = sortedScores.slice(0, Math.floor(sortedScores.length / 2));
  const upperHalf = sortedScores.slice(Math.ceil(sortedScores.length / 2));
  return {
    min: sortedScores[0],
    q1: calculateMedian(lowerHalf),
    median: calculateMedian(sortedScores),
    q3: calculateMedian(upperHalf),
    max: sortedScores[sortedScores.length - 1]
  }
}

export function calculateSubTargetCompleted(studentTaskDataList: Array<Array<{
  [key: string]: string
}>>, subTargetLength: number) {
  let completedMember: Array<number> = new Array<number>(subTargetLength).fill(0)
  let notCompletedMember: Array<number> = new Array<number>(subTargetLength).fill(0)
  let unselectMember: Array<number> = new Array<number>(subTargetLength).fill(0)
  for (const taskData of studentTaskDataList) {
    const completed = taskData[0]['完成項目']
    if (taskData[0]['選擇項目'] === 'None') for (let i = 0; i < unselectMember.length; i++) unselectMember[i]++;
    else if (taskData[0]['完成項目'] === 'None') {
      for (let i = 0; i < subTargetLength; i++) notCompletedMember[i]++;
    } else {
      const completedAry = JSON.parse(completed.toLowerCase())[0]
      completedAry.map((value: number, index: number) => value ? completedMember[index]++ : notCompletedMember[index]++)
    }
  }

  return {
    completed: completedMember,
    notCompleted: notCompletedMember,
    unselected: unselectMember
  }
}

