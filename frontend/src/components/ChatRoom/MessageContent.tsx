// style
import {
  Card,
  CardHeader,
  Typography,
  CardBody
} from "@material-tailwind/react";

// API

// components

// interface

import {IMessages} from "../../utils/interface/chatRoom";


const MessageContentComponent = (props: IMessages) => {
  const {time, studentId, name, message, type} = props

  return (
    <div className='max-w-[16rem] animate-messageSlideIn'>
      <div>
        <Typography className='text-sm' placeholder={undefined}>{name} {studentId}</Typography>
      </div>
      <div className={`rounded-md py-2 px-4 ${type === 'User' ? 'bg-light-blue-200' : 'bg-white' }`}>
        <Typography variant='paragraph' className='font-normal text-left whitespace-pre-wrap' placeholder={undefined}>{message}</Typography>
      </div>
      <div>
         <Typography className='text-[0.5rem]' placeholder={undefined}>{time}</Typography>
      </div>
    </div>
  )
}

export default MessageContentComponent