import React, {useEffect, useRef, useState} from "react";
// style
import {IconButton, Typography} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

// API

// components
import TextAreaComponent from "./TextArea";
import MessageContentComponent from "./MessageContent";

// interface
import {IMessages} from "../../utils/interface/chatRoom";

interface IChatRoomProps {
  name: string
  userStudentId: string | undefined
  setOpenChatRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatRoomComponent = (props: IChatRoomProps) => {
  const {name, userStudentId, setOpenChatRoom} = props

  const [messageInput, setMessageInput] = useState<string>("")
  const [isSubmitMessage, setIsSubmitMessage] = useState<boolean>(false)

  const messageBottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Array<IMessages>>([
    {
      time: '2025-3-7 15:30',
      name: 'Henry',
      studentId: '1082020',
      message: '今天天氣真好！'
    },
    {
      time: '2025-3-7 15:30',
      name: 'ccj',
      studentId: 'ccj',
      message: '今天天氣真好！出去玩吃壽寺好讚妳好'
    },
    {
      time: '2025-3-7 15:30',
      name: 'Henry',
      studentId: '1082020',
      message: '今天天氣真好！今天天氣真好今天天氣真好今天天氣真好'
    },
  ]);

  // 送出訊息
  useEffect(() => {
    if (isSubmitMessage && userStudentId && messageInput != '') {
      setMessages(prevState => {
        const newMessage: IMessages = {
          time: new Date().toLocaleTimeString(),
          name: name,
          studentId: userStudentId,
          message: messageInput,
        }
        return [...prevState, newMessage]
      })


      setIsSubmitMessage(false)
      setMessageInput("")
    }
  }, [isSubmitMessage])

  // 當 messages 更新時，自動滾動到最下方
  useEffect(() => {
    if (messageBottomRef.current) {
      messageBottomRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);


  return (
    <div
      className="overflow-hidden flex flex-col justify-between min-w-[24rem] min-h-[40rem] bg-stamindTask-white-200 rounded-xl shadow-lg shadow-stamindTask-primary-blue-600 animate-loginSlideIn">
      <div className='flex justify-between bg-stamindTask-black-850 p-3 gap-x-2'>
        <div className='flex items-center gap-x-2'>
          <img src='/files/img/logo.PNG' width='36'/>
          <Typography variant="h5" color='blue' textGradient placeholder={undefined}>AmumAmum 助理</Typography>
        </div>
        <IconButton
          variant="text"
          color='white'
          placeholder={undefined}
          onClick={() => setOpenChatRoom(false)}
        >
          <XMarkIcon className='h-5 w-5 color-white'/>
        </IconButton>
      </div>
      <div className='h-[32rem] overflow-scroll'>
        <div className='flex flex-col h-full px-3'>
          {messages.length > 0 ?
            messages.map(({message, studentId, time, name}, i) => {
              const isUserOrOther = userStudentId === studentId

              return (
                <div className={isUserOrOther ? 'self-end text-right' : 'self-start text-left'}>
                  <MessageContentComponent
                    type={isUserOrOther ? 'User' : 'Other'}
                    message={message}
                    studentId={studentId}
                    time={time}
                    name={name}
                    key={i}
                  />
                </div>
              )
            }) :
            <Typography
              variant="paragraph"
              color='blue'
              textGradient
              placeholder={undefined}
              className='text-center'
            >
              開始聊天！
            </Typography>
          }
          <div ref={messageBottomRef}></div>
        </div>
      </div>
      <div className="relative flex w-full max-w-[24rem]">
        <TextAreaComponent messageInput={messageInput} setMessageInput={setMessageInput}
                           setIsSubmitMessage={setIsSubmitMessage}/>
      </div>
    </div>
  )
}

export default ChatRoomComponent;