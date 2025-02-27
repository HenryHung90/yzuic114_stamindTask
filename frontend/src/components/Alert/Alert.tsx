import React, {useEffect, useState} from 'react'
// style
import {Alert} from "@material-tailwind/react";

// API

// components

// interface
interface IAlertProps {
  content: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AlertMsg = (props: IAlertProps) => {
  const {content, open, setOpen} = props

  useEffect(() => {
    setTimeout(() => {
      if (open) setOpen(false)
    }, 3000)
  }, [content]);

  return (
    <Alert open={open} onClose={() => setOpen(false)}
           className="fixed top-10 left-1/2 !-translate-x-1/2 w-[50%] h-14 bg-gradient-to-br from-red-500 to-yellow-500 text-white shadow-lg"
    >{content}</Alert>
  )
}

export default AlertMsg