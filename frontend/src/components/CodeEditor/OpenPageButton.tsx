import React from "react"
// style
import {Button, Typography} from "@material-tailwind/react";

// API

// components

// interface
interface IOpenPageButtonProps {
  title: string
  icon: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  dataObject: string
}


const OpenPageButtonComponent = (props: IOpenPageButtonProps) => {
  const {title, icon, open, setOpen, dataObject} = props

  const handleClickOpen = () => {
    setOpen(!open)
  }

  return (
    <div className='flex items-center gap-x-4'>
      <Typography className='text-sm font-bold' placeholder={undefined}>{title}：{open ? "開" : "關"}</Typography>
      <Button
        size='sm'
        color='blue-gray'
        className='flex items-center justify-center h-6 w-6'
        placeholder={undefined}
        onClick={handleClickOpen}
        data-action='click'
        data-type='button'
        data-object={open ? `processClose${dataObject}` : `processOpen${dataObject}`}
        data-id={open ? `task_processClose${dataObject}` : `task_processOpen${dataObject}`}
      >
        {icon}
      </Button>
    </div>
  )
}

export default OpenPageButtonComponent