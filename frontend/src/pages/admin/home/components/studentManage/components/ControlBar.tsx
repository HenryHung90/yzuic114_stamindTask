import React, {useRef} from "react";
// style
import {Button, Input, Option, Select} from "@material-tailwind/react"
// API
import {
  handleAddNewStudent, handleDownloadAllStudentTask,
  handleDownloadStudentList, handleDownloadStudentTaskByClassName, handleDownloadStudentTaskByStudentId,
  handleUploadStudentList, handleDownloadAllStudentRecords
} from "../../../../../../utils/functions/admin/home/components/controlBar";
// components
import MenuComponent, {IMenuItems} from "../../../../../../components/menu/Menu";
// interface
import {IStudentManageControlBarProps} from "../../../../../../utils/interface/adminManage";

const ControlBarComponent = (props: IStudentManageControlBarProps) => {
  const {
    studentList,
    classList,
    className,
    setClassName,
    searchStudentId,
    setSearchStudentId,
    settingAlertLogAndLoading
  } = props

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 處理文件選擇並自動上傳
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadStudentList(event, fileInputRef, settingAlertLogAndLoading)
  }
  // 按下按鈕時觸發文件選擇框
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const STUDENT_MANAGE_MENU_ITEMS = (): Array<IMenuItems> => [
    {
      name: "新增單一學生",
      handleClick: () => handleAddNewStudent(settingAlertLogAndLoading)
    },
    {
      name: "下載學生名單",
      handleClick: () => handleDownloadStudentList(settingAlertLogAndLoading)
    },
    {
      name: "批量上傳學生",
      handleClick: () => handleButtonClick()
    }
  ]

  const STUDENT_TASK_CONTENT_MENU_ITEMS = (): Array<IMenuItems> => [
    {
      name: '全部學生',
      handleClick: () => handleDownloadAllStudentTask(settingAlertLogAndLoading)
    },
    {
      name: '依班級',
      handleClick: () => handleDownloadStudentTaskByClassName(settingAlertLogAndLoading, classList)
    },
    {
      name: '依學號',
      handleClick: () => handleDownloadStudentTaskByStudentId(settingAlertLogAndLoading, studentList)
    }
  ]

  return (
    <div className='md:flex justify-between my-5 p-5 rounded-2xl bg-stamindTask-black-600 bg-opacity-50'>
      <div className='md:flex gap-6 mb-3 md:mb-0'>
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
      <div className='flex gap-6'>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={handleFileChange}
        />
        <MenuComponent menuHandler={"學生管理"} menuItems={STUDENT_MANAGE_MENU_ITEMS()}/>
        <MenuComponent menuHandler={"學生課程資料下載"} menuItems={STUDENT_TASK_CONTENT_MENU_ITEMS()}/>
        <Button
          placeholder={undefined}
          onClick={() => handleDownloadAllStudentRecords(settingAlertLogAndLoading)}>
          下載所有學生行為記錄
        </Button>
      </div>
    </div>
  )
}

export default ControlBarComponent;