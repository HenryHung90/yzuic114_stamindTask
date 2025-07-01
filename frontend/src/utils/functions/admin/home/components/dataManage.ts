import {convertToXlsxFile} from "../../../common"

// 處理下載Excel檔案
export const handleDownloadExcel = (words: Array<{ text: string, value: number }>, filteredWords: Array<{
  text: string,
  value: number
}>) => {
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `wordcloud_data_${timestamp}`;
  const workbookNames = ['全部詞彙', '已過濾詞彙'];
  const allWordsData = words.map((word, index) => ({
    '序號': index + 1,
    '詞彙': word.text,
    '頻率': word.value
  })) as any[];

  const filteredWordsData = filteredWords.map((word, index) => ({
    '序號': index + 1,
    '詞彙': word.text,
    '頻率': word.value
  })) as any[];

  // 調用轉換函數
  convertToXlsxFile(fileName, workbookNames, [allWordsData, filteredWordsData]);
};