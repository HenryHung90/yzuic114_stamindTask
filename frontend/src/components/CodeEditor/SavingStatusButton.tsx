import React, {useEffect} from "react"
// style
import {Button, Typography} from "@material-tailwind/react";

// API

// components

// interface
interface ISavingStatusProps {
  codeStatus: 'sync' | 'uploading' | 'bad' | 'async'
  handleClickSave: () => void
}


const SavingStatusButtonComponent = (props: ISavingStatusProps) => {
  const {codeStatus, handleClickSave} = props

  const iconStatus = () => {
    switch (codeStatus) {
      case 'sync':
        return '🟢'
      case 'async':
        return '🟠'
      case 'uploading':
        return '🟡'
      case 'bad':
        return '🔴'
    }
  }

  return (
    <div className='flex items-center gap-x-4'>
      <Typography className='text-sm font-bold' placeholder={undefined}>儲存狀態：{iconStatus()}</Typography>
      <Button
        size='sm'
        color='blue-gray'
        className='flex items-center justify-center h-6 w-6'
        placeholder={undefined}
        onClick={handleClickSave}
      >
        💾
      </Button>
    </div>
  )
}

export default SavingStatusButtonComponent