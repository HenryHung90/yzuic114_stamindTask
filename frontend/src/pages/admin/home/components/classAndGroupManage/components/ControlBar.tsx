import React from "react";
// style
import {Button, Menu, MenuList, MenuHandler, MenuItem} from "@material-tailwind/react"
// API
import {handleAddNewClass} from "../../../../../../utils/functions/admin/home/components/controlBar";
// components
// interface
import {Res_classNamesInfo} from "../../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../../utils/interface/alertLog";

interface IControlBarProps {
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const ControlBarComponent = (props: IControlBarProps) => {
  const {settingAlertLogAndLoading} = props

  const controlButtons = [
    {
      onClick: () => handleAddNewClass(settingAlertLogAndLoading),
      name: '新增班級'
    },
  ]

  return (
    <div className='block lg:flex justify-between my-5 p-5 rounded-2xl bg-stamindTask-black-600 bg-opacity-50'>
      {/*左側欄*/}
      <div className='block gap-6 lg:flex'></div>
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