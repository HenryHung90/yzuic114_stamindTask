import React, {useState, useEffect} from 'react'
// style
import {Button} from "@material-tailwind/react";

// API

// components

// interface
interface IFileUploadProps {
  handleUploadFile: () => void
  type: 'HTML' | 'PDF2images'
  fileInputRef: React.RefObject<HTMLInputElement>
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAlertContent: React.Dispatch<React.SetStateAction<string>>
  setFileData: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<Array<string>>>
}

const FileUploadComponent = (props: IFileUploadProps) => {
  const {handleUploadFile, type, fileInputRef, setAlertOpen, setAlertContent, setFileData} = props

  const [fileName, setFileName] = useState<string>("")

  // 檔案大小限制
  const getLimitOfFile = (type: string): number => {
    const mb = 1024 * 1024
    switch (type) {
      case 'HTML':
        return mb;
      case 'PDF2images':
        return 10 * mb;
      default:
        return mb;
    }
  };

  // 處理按下按鈕時的事件
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 觸發 input 的點擊事件
    }
  };

  // 處理檔案選擇事件
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // 檔案限制大小
      if (files[0].size > getLimitOfFile(type)) {
        setAlertOpen(true)
        setAlertContent(`🚫檔案大小不得超過 ${getLimitOfFile(type) / 1024} MB`)
        if (fileInputRef.current) fileInputRef.current.value = ""; // 清空 input 的值
      } else {
        setFileName(files[0].name)
        // 本地預覽
        const fileURL = URL.createObjectURL(files[0])
        if (type == 'HTML') (setFileData as React.Dispatch<React.SetStateAction<string>>)(fileURL)
      }
    }
  };

  // 限制上傳檔案類型
  const getAcceptType = (type: string): string => {
    switch (type) {
      case 'HTML':
        return '.html';
      case 'PDF2images':
        return '.pdf';
      default:
        return '';
    }
  };

  return (
    <div className='flex gap-x-2'>
      <Button variant="gradient" placeholder={undefined} onClick={handleButtonClick}>上傳檔案</Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{display: "none"}}
        accept={getAcceptType(type)}
        onChange={handleFileChange}
      />
      <p className='flex items-center w-64 overflow-hidden truncate'>{fileName}</p>
      <Button
        variant="gradient"
        placeholder={undefined}
        onClick={handleUploadFile}
      >
        確認上傳
      </Button>
    </div>
  )
}

export default FileUploadComponent