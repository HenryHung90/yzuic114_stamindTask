import React from "react";
// style
import {Button, Option, Select} from "@material-tailwind/react"
// API
import {handleAddNewGroup} from "../../../../../../utils/functions/admin/home/components/controlBar";
// components
// interface
import {IControlBarProps} from "../../../../../../utils/interface/adminManage";

const ControlBarComponent = (props: IControlBarProps) => {
  const {classList, className, setClassName, settingAlertLogAndLoading} = props
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
      </div>
      <div className='flex gap-6'>
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={() => handleAddNewGroup(classList, settingAlertLogAndLoading)}>
          新增年級
        </Button>
      </div>
    </div>
  )
}

export default ControlBarComponent;