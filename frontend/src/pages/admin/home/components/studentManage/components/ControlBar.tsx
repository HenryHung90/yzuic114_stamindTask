import React from "react";
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
import {Res_classNamesInfo} from "../../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../../utils/interface/alertLog";

interface IStudentManageProps {
  classList: Array<Res_classNamesInfo>
  className: string
  setClassName: React.Dispatch<React.SetStateAction<string>>
  searchStudentId: string
  setSearchStudentId: React.Dispatch<React.SetStateAction<string>>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const ControlBarComponent = (props: IStudentManageProps) => {
  const {classList, className, setClassName, searchStudentId, setSearchStudentId, settingAlertLogAndLoading} = props
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
            {classList.map(({name}, index) => (
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
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={() => handleUploadStudentList(settingAlertLogAndLoading)}>
          批量上傳學生
        </Button>
      </div>
    </div>
  )
}

export default ControlBarComponent;