import * as XLSX from 'xlsx'

export enum EGroupType {
  NONE = 'NONE',
  EXPERIMENTAL = 'EXPERIMENTAL',
  CONTROL = 'CONTROL'
}


function calculateTimer(startTime: number) {
  return Math.floor((Date.now() - startTime) / 1000).toString()
}

function convertToXlsxFile(sheetName: string, workbookName: string, data: []) {
  // 將數據轉換為工作表
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 創建工作簿並添加工作表
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, workbookName);

  // 將工作簿轉換為二進制數據
  const workbookBinary = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

  // 創建 Blob 對象
  const blob = new Blob([workbookBinary], {type: 'application/octet-stream'});

  // 創建下載鏈接並觸發下載
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sheetName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export {calculateTimer, convertToXlsxFile}