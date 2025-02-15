import React, {useEffect, useState} from "react";
// style
import {Button, Menu, MenuList, MenuHandler, MenuItem, Input, Option, Select} from "@material-tailwind/react"
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

  const controlButtons = [
    {
      onClick: () => handleAddNewStudent(settingAlertLogAndLoading),
      name: '新增學生'
    },
    {
      onClick: () => handleDownloadStudentList(settingAlertLogAndLoading),
      name: '下載學生名單'
    },
    {
      onClick: () => handleUploadStudentList(settingAlertLogAndLoading),
      name: '批量上傳學生'
    }
  ]

  return (
    <div className='block lg:flex justify-between my-5 p-5 rounded-2xl bg-stamindTask-black-600 bg-opacity-50'>
      {/*左側欄*/}
      <div className='block gap-6 lg:flex'>
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
        <div className='mt-5 lg:mt-0'>
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
      {/*右側欄*/}
      <div className='hidden gap-6 lg:flex'>
        {controlButtons.map(({onClick, name}, index) => (
          <Button key={index} variant="gradient" onClick={onClick} placeholder={undefined}>
            {name}
          </Button>
        ))}
      </div>
      <div className='block mt-6 lg:hidden'>
        <Menu>
          <MenuHandler>
            <Button variant="gradient" color='white' placeholder={undefined}>設定</Button>
          </MenuHandler>
          <MenuList placeholder={undefined}>
            {controlButtons.map(({onClick, name}, index) => (
              <MenuItem key={index} onClick={onClick} placeholder={undefined}>
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}

export default ControlBarComponent;