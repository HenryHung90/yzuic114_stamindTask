import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css'; // 引入 Highlight.js 的樣式

// style
import {Typography} from "@material-tailwind/react";

// API

// components

// interface
import {IMessages} from "../../utils/interface/chatRoom";
import MarkDownTextComponent from "../MarkDownText/MarkDownText";


const MessageContentComponent = (props: IMessages) => {
  const {time, studentId, name, message, type} = props

  return (
    <div className='max-w-[20rem] animate-messageSlideIn'>
      <div>
        <Typography className='text-sm' placeholder={undefined}>{name} {studentId}</Typography>
      </div>
      <div className={`rounded-md py-2 px-4 ${type === 'User' ? 'bg-light-blue-200' : 'bg-white'}`}>
        <div
          className={`${type === 'Waiting' && 'bg-[length:600%_100%] bg-no-repeat bg-gradient-to-r from-light-blue-200 via-blue-500 to-light-blue-200 bg-clip-text animate-marquee'}`}>
          <MarkDownTextComponent text={message}/>
        </div>
      </div>
      <div>
        <Typography className='text-[0.5rem]' placeholder={undefined}>{time}</Typography>
      </div>
    </div>
  )
}

export default MessageContentComponent