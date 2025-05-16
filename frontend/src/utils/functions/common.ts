import * as XLSX from 'xlsx'
import {ISettingAlertLogAndLoading} from "../interface/alertLog";

export enum EGroupType {
  NONE = 'NONE',
  EXPERIMENTAL = 'EXPERIMENTAL',
  CONTROL = 'CONTROL'
}


function calculateTimer(startTime: number) {
  return Math.floor((Date.now() - startTime) / 1000).toString()
}

function convertToXlsxFile(sheetName: string, workbookNames: Array<string>, data: Array<Array<JSON>>) {
  // 創建工作簿並添加工作表
  const workbook = XLSX.utils.book_new();
  const sheetNameWithFileType = sheetName + '.xlsx'

  for (let i = 0; i < workbookNames.length; i++) {
    // Convert each dataset to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data[i]);
    // Append the worksheet to the workbook with the corresponding name
    XLSX.utils.book_append_sheet(workbook, worksheet, workbookNames[i]);
  }


  // 將工作簿轉換為二進制數據
  const workbookBinary = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

  // 創建 Blob 對象
  const blob = new Blob([workbookBinary], {type: 'application/octet-stream'});

  // 創建下載鏈接並觸發下載
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sheetNameWithFileType;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function handlePromise(messageTitle: string, messageInfo: string, loading: ISettingAlertLogAndLoading, fetchTaskListAsync: () => void) {
  loading.setAlertLog(messageTitle, messageInfo)
  loading.setLoadingOpen(false)
  fetchTaskListAsync()
}

function autoDownloadFile(filePath: string, fileName: string) {
  const a = document.createElement('a');
  console.log(filePath)
  a.href = filePath;
  document.body.appendChild(a);
  a.click(); // 自動點擊以開始下載
  a.remove(); // 移除元素
}

export {calculateTimer, convertToXlsxFile, handlePromise, autoDownloadFile}