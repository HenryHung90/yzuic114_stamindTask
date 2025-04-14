import React, {useRef} from "react";
// style
import {Button, Input, Option, Select} from "@material-tailwind/react"
// API
import {
  handleAddNewStudent,
  handleDownloadStudentList,
  handleUploadStudentList
} from "../../../../../../utils/functions/admin/home/components/controlBar";
// components
// interface
import {IStudentManageControlBarProps} from "../../../../../../utils/interface/adminManage";

const ControlBarComponent = (props: IStudentManageControlBarProps) => {
  const {classList, className, setClassName, searchStudentId, setSearchStudentId, settingAlertLogAndLoading} = props

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 處理文件選擇並自動上傳
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadStudentList(event, fileInputRef, settingAlertLogAndLoading)
  }
  // 按下按鈕時觸發文件選擇框
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className='flex justify-between my-5 p-5 rounded-2xl bg-stamindTask-black-600 bg-opacity-50'>
      <div className='flex gap-6'>
        <div>
          <Select
            value={className}
            onChange={(val) => {
              setClassName(val ?? 'ALL')
            }}
            color="orange"
            variant="standard"
            label="選擇年級"
            labelProps={{
              className: 'text-white',
            }}
            placeholder={undefined}
            className='text-stamindTask-white-000 border-white'
          >
            <Option value={"ALL"}>全部</Option>
            {classList?.map(({name}, index) => (
              <Option key={index} value={name}>{name}</Option>
            ))}
          </Select>
        </div>
        <div>
          <Input
            value={searchStudentId}
            onChange={e => {
              setSearchStudentId(e.target.value)
            }}
            variant="standard"
            color='white'
            label="搜尋學號"
            placeholder="學號"
            className='border-white'
            crossOrigin={undefined}/>
        </div>
      </div>
      <div className='flex gap-6'>
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={() => handleAddNewStudent(settingAlertLogAndLoading)}>
          新增單一學生
        </Button>
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={() => handleDownloadStudentList(settingAlertLogAndLoading)}>
          下載學生名單
        </Button>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={handleFileChange}
        />
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleButtonClick}>
          批量上傳學生
        </Button>
      </div>
    </div>
  )
}

export default ControlBarComponent;