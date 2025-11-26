import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

import {ISettingAlertLogAndLoading} from "../interface/alertLog"

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
  a.href = filePath;
  document.body.appendChild(a);
  a.click(); // 自動點擊以開始下載
  a.remove(); // 移除元素
}

// 處理截圖視窗
async function autoScreenShot(element: HTMLElement | HTMLDivElement, filename: string = 'screenshot') {
  try {
    const originalStyles = {
      height: element.style.height,
      overflow: element.style.overflow,
      maxHeight: element.style.maxHeight,
      position: element.style.position
    };

    // 臨時修改樣式
    element.style.height = 'auto';           // 移除高度限制
    element.style.overflow = 'visible';      // 移除滾動
    element.style.maxHeight = 'none';        // 移除最大高度限制
    element.style.position = 'static';       // 確保正常佈局
    element.offsetHeight;

    await new Promise(resolve => setTimeout(resolve, 500));

    const rect = element.getBoundingClientRect();
    const actualWidth = Math.max(element.scrollWidth, rect.width);
    const actualHeight = Math.max(element.scrollHeight, rect.height);

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 1,
      scrollX: 0,
      scrollY: 0,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      width: actualWidth,
      height: actualHeight,
      backgroundColor: '#ffffff'
    });

    element.style.height = originalStyles.height;
    element.style.overflow = originalStyles.overflow;
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.position = originalStyles.position;

    // 創建下載連結
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `${filename}-${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');

    // 觸發下載
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('截圖失敗:', error);
    alert('截圖失敗，請稍後再試');
    return false;
  }
}

export {calculateTimer, convertToXlsxFile, handlePromise, autoDownloadFile, autoScreenShot}