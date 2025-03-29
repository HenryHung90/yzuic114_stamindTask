import homeTable from "./home";
import taskTable from "./task";
import speedDialTable from "./speedDial";
import carouselTable from "./carousel";
import React from "react";

// verb	         String	  行為動詞，例如 "點擊", "完成"
// -- view	    學生瀏覽課程首頁、閱讀文章或觀看影片。
// -- click	    學生點擊「開始學習」按鈕或選擇某個課程單元。
// -- input	    學生在搜尋框中輸入文字或填寫測驗答案。
// -- submit	  學生提交作業、完成測驗或送出表單。
// -- interact  學生播放影片、展開課程章節或拖動進度條。
// -- navigate	學生跳轉到下一頁、返回上一頁或展開側邊欄。
// time     	   String	  行為發生時間
// timer     	   String	  行為發生時間經過（可選）
// object_id	   String	  被操作對象的 ID，例如網頁上的按鈕或區塊的 ID
// object_type	 String	  被操作對象的類型，例如 "按鈕", "頁面"
// object_name	 String	  被操作對象的名稱（可選，便於查閱）
// context	     JSONField	行為的上下文資訊，例如設備、瀏覽器等
// ->description String 行為完整描述
// ->device      String 操作電腦、瀏覽器等資訊
//   ->agent     String 使用者瀏覽器
//   ->platform  String 使用者OS
//   ->isMobile  String 是否為觸控裝置
// ->status      String 操作行為狀態是否成功
interface IStudentRecords {
  verb: string
  time: string
  timer: string | null
  objectType: string
  objectName: string
  objectId: string
  context: {
    description: string
    device: IDeviceInfo
    status: string
  }
}

interface IDeviceInfo {
  agent: string | null
  platform: string | null
  isMobile: boolean | null
}

interface IDataset extends DOMStringMap {
  action?: string
  type?: string
  object?: string
  timer?: string
  id?: string
}


const actionTable: Record<string, string> = {
  'view': '檢視',
  'click': '點擊',
  'input': '輸入',
  'submit': '提交',
  'interact': '交互',
  'navigate': '導向',
}

const typeTable: Record<string, string> = {
  'button': '按鈕',
  'taskNode': '任務節點',
  'text': '文字',
  'checkbox': '選擇鈕',
  'tab': '分頁',
  'inputField': '文字輸入',
}

// 找使用者使用的瀏覽器
function findAgent() {
  const userAgent = navigator.userAgent
  // 判斷瀏覽器類型
  if (userAgent.includes("Chrome")) return 'Google Chrome'
  else if (userAgent.includes("Firefox")) return 'Firefox'
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return 'Safari'
  else if (userAgent.includes("Edge")) return 'Edge'
  else return 'Unknown Agent'
}

// 找使用者使用的作業系統
function findPlatform() {
  // 使用 userAgent 作為回退方案
  const userAgent = navigator.userAgent;
  if (/Windows/i.test(userAgent)) return 'Windows'
  else if (/Macintosh/i.test(userAgent)) return 'MacOS'
  else if (/Linux/i.test(userAgent)) return 'Linux'
  else if (/Android/i.test(userAgent)) return 'Android'
  else if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
  else return 'Unknown Platform'
}

// 找是否為觸控裝置
function findIsMobile() {
  const touchPoints = navigator.maxTouchPoints
  return touchPoints > 0
}

// 產生 User Device Info
const handleGetUserDeviceInfo = () => {
  const info: IDeviceInfo = {
    agent: null,
    platform: null,
    isMobile: null
  }
  info.agent = findAgent()
  info.platform = findPlatform()
  info.isMobile = findIsMobile()
  return info
}

// Debounce
function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// 防抖函數的全局實例（延遲 1000 毫秒）
const debouncedRecord = debounce((recordChange: () => void) => {
  recordChange()
}, 1000)
const handleCustomRecord = (
  formatedDataset: IDataset,
  useDebounce: boolean,
  studentId: string,
  setTempStudentRecords: React.Dispatch<React.SetStateAction<Array<IStudentRecords>>> | undefined
) => {
  const recordChange = () => {
    const recordData = handleTranslateAction({
      action: formatedDataset.action,
      type: formatedDataset.type,
      timer: formatedDataset.timer ?? '',
      object: formatedDataset.object,
      id: formatedDataset.id
    }, studentId || '')
    if (recordData) setTempStudentRecords?.(prevState => [...prevState, recordData])
  }

  // 決定是否使用 Debounce
  useDebounce ? debouncedRecord(recordChange) : recordChange()
}


function handleTranslateAction(dataset: IDataset, studentId: string) {
  if (dataset.action && dataset.type && dataset.object && dataset.id && studentId) {
    const formattedTime = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const tables = {
      home: homeTable,
      task: taskTable,
      speedDial: speedDialTable,
      carousel: carouselTable,
    };

    const verb = actionTable[dataset.action]
    const time = formattedTime
    const objectType = typeTable[dataset.type]
    const objectPage = dataset.id.split("_")[0]
    const objectActionName = dataset.object.split("_")
    const objectTimer = dataset.timer ?? ""

    // 有該 table 後，判斷 [1] 是否有值
    const table = tables[objectPage as keyof typeof tables];
    const objectName = table
      ? objectActionName[1]
        ? table[objectActionName[0]] + " " + objectActionName[1]
        : table[dataset.object]
      : '';

    const formattedRecord: IStudentRecords = {
      verb: verb,
      time: time,
      objectId: dataset.id,
      objectType: objectType,
      objectName: objectName,
      timer: objectTimer,
      context: {
        description: `使用者 ${studentId} 在 ${time} 時執行了 ${verb} ${objectName} 的動作。${objectTimer ? `耗時 ${objectTimer} 秒` : ''}`,
        device: handleGetUserDeviceInfo(),
        status: 'created'
      }
    }
    return formattedRecord
  }
}

export {handleCustomRecord, handleTranslateAction}
export type {IStudentRecords}