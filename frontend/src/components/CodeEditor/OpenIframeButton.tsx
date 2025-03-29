import React from "react"
// style
import {Button, Typography} from "@material-tailwind/react";

// API

// components

// interface
interface IOpenIframeButtonProps {
  openIframe: boolean;
  setOpenIframe: React.Dispatch<React.SetStateAction<boolean>>
}


const OpenIframeButtonComponent = (props: IOpenIframeButtonProps) => {
  const {openIframe, setOpenIframe} = props

  const handleClickOpenIframe = () => {
    setOpenIframe(!openIframe)
  }

  return (
    <div className='flex items-center gap-x-4'>
      <Typography className='text-sm font-bold' placeholder={undefined}>預覽畫面：{openIframe ? "開" : "關"}</Typography>
      <Button
        size='sm'
        color='blue-gray'
        className='flex items-center justify-center h-6 w-6'
        placeholder={undefined}
        onClick={handleClickOpenIframe}
        data-action='click'
        data-type='button'
        data-object={openIframe ? "processCloseIframe" : "processOpenIframe"}
        data-id={openIframe ? "task_processCloseIframe" : "task_processOpenIframe"}
      >
        🖥️
      </Button>
    </div>
  )
}

export default OpenIframeButtonComponent