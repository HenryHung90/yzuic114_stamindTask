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
import {API_chatWithAmumAmum} from "../../utils/API/API_ChatGPT";
import {API_getChatHistories} from "../../utils/API/API_ChatHistories";

interface IChatRoomProps {
  name: string
  userStudentId: string | undefined
  setOpenChatRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatRoomComponent = (props: IChatRoomProps) => {
  const {name, userStudentId, setOpenChatRoom} = props

  const messageOffsetRef = useRef<number>(0);
  const isMessageTopRef = useRef<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>("")
  const [isSubmitMessage, setIsSubmitMessage] = useState<boolean>(false)

  const messageBottomRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Array<IMessages>>([])

  const fetchMessageHistory = () => {
    if (!isMessageTopRef.current) {
      API_getChatHistories(messageOffsetRef.current).then(response => {
        if (response.data.messages == 'empty') return isMessageTopRef.current = true

        const history_list: Array<IMessages> = response.data.messages
        setMessages(prevState => {
          return [...history_list, ...prevState]
        })
        messageOffsetRef.current += 10
      })
    }
  }
  const handleScrollToChatContainerTop = () => {
    if (chatContainerRef.current) {
      const scrollTop = chatContainerRef.current.scrollTop;
      if (scrollTop === 0) {
        fetchMessageHistory()
      }
    }
  };

  // 取得訊息歷史
  useEffect(() => {
    fetchMessageHistory()
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScrollToChatContainerTop);
    }
    // 清除事件監聽器
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScrollToChatContainerTop);
      }
    };
  }, []);

  // 送出訊息
  useEffect(() => {
    if (isSubmitMessage && userStudentId && messageInput != '') {
      // 新增自己送出的訊息
      setMessages(prevState => {
        const newMessage: IMessages = {
          time: new Date().toLocaleTimeString(),
          name: name,
          studentId: userStudentId,
          message: messageInput,
        }
        return [...prevState, newMessage]
      })
      // 將訊息送出給 Chat
      API_chatWithAmumAmum(messageInput).then(response => {
        const assistant = response.data.assistant
        setMessages(prevState => {
          const newMessage: IMessages = {
            time: assistant.time,
            name: assistant.name,
            studentId: assistant.student_id,
            message: assistant.message,
          }
          return [...prevState, newMessage]
        })
        setIsSubmitMessage(false)
      })
      setMessageInput("")
    }
  }, [isSubmitMessage])

  // 當 messages 更新時，自動滾動到最下方
  useEffect(() => {
    if (messageBottomRef.current) {
      messageBottomRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [isSubmitMessage]);


  return (
    <div
      className="overflow-hidden flex flex-col justify-between min-w-[24rem] min-h-[40rem] bg-stamindTask-white-200 rounded-xl shadow-lg shadow-stamindTask-primary-blue-600 animate-tooltipSlideIn">
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
      <div ref={chatContainerRef} className='h-[32rem] overflow-scroll'>
        <div className='flex flex-col h-full px-3'>
          {
            isMessageTopRef.current &&
              <Typography
                  color='blue-gray'
                  textGradient
                  placeholder={undefined}
                  className='text-center text-sm my-2'
              >
                  已經到底了！
              </Typography>
          }
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
            })
            :
            <Typography
              variant="h5"
              color='blue'
              textGradient
              placeholder={undefined}
              className='text-center'
            >
              開始聊天！
            </Typography>
          }
          {
            isSubmitMessage &&
              <MessageContentComponent
                  type={'Waiting'}
                  message={'Amum Amum 正在思考中...'}
                  studentId={''}
                  time={''}
                  name={''}
              />
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