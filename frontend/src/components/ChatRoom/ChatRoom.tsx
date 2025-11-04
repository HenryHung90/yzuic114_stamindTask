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
import {handleCustomRecord, IStudentRecords} from "../../utils/listener/action";
import ImageComponent from "../Image/Image";

// 思考中的有趣訊息集合
const THINKING_MESSAGES = [
  "Amum Amum 正在思考中，請耐心等待...",
  "Amum Amum 正在深入思考您的問題，馬上回來...",
  "Amum Amum 正在檢索相關知識，很快就好...",
  "Amum Amum 正在整理答案，即將完成...",
  "Amum Amum 腦袋正在高速運轉中...",
  "Amum Amum 正在揣摩您問題的精髓...",
  "Amum Amum 正在召喚靈感，請稍等...",
  "Amum Amum 正在跟程式之神溝通中...",
  "Amum Amum 正在搜索知識的海洋...",
  "Amum Amum 正在激活超級思維模式..."
];

interface IChatRoomProps {
  name: string
  taskId: string
  userStudentId: string | undefined
  openChatRoom: boolean
  setOpenChatRoom: React.Dispatch<React.SetStateAction<boolean>>
  setTempStudentRecords?: React.Dispatch<React.SetStateAction<Array<IStudentRecords>>>;
}

const ChatRoomComponent = (props: IChatRoomProps) => {
  const {name, taskId, userStudentId, openChatRoom, setOpenChatRoom, setTempStudentRecords} = props

  const messageOffsetRef = useRef<number>(0);

  const [isMessageEnded, setIsMessageEnded] = useState<boolean>(false)
  const [messageInput, setMessageInput] = useState<string>("")
  const [isSubmitMessage, setIsSubmitMessage] = useState<boolean>(false)

  const messageBottomRef = useRef<HTMLDivElement>(null)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const previousScrollHeightRef = useRef<number>(0);


  const [messages, setMessages] = useState<Array<IMessages>>([])

  const [thinkingSeconds, setThinkingSeconds] = useState<number>(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0)

  // 添加思考秒數計時器
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isSubmitMessage) {
      setThinkingSeconds(0); // 重置秒數
      setCurrentMessageIndex(0); // 重置消息索引

      timer = setInterval(() => {
        setThinkingSeconds(prev => {
          const newSeconds = prev + 1;
          // 每3秒切換一次消息
          if (newSeconds % 3 === 0) {
            setCurrentMessageIndex(Math.floor(Math.random() * THINKING_MESSAGES.length));
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      setThinkingSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSubmitMessage]);

  // 取得訊息歷史
  const fetchMessageHistory = async () => {
    if (!isMessageEnded) {
      API_getChatHistories(messageOffsetRef.current, taskId).then(response => {
        if (response.data.messages == 'empty') return setIsMessageEnded(true)

        const history_list: Array<IMessages> = response.data.messages
        if (history_list) {
          setMessages(prevState => {
            return [...history_list, ...prevState]
          })
          messageOffsetRef.current += 10
        }
      })
    }
  }

  // 滑到最上後更新
  const handleScrollToChatContainerTop = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop === 0) {
      fetchMessageHistory().then(res => {
        // 延遲後滑動到原位置
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - previousScrollHeightRef.current
            previousScrollHeightRef.current = chatContainerRef.current.scrollHeight
          }
        }, 50)
      })

    }
  }

  // 檢測輸入
  useEffect(() => {
    if (messageInput != '') {
      handleCustomRecord({
        action: 'input',
        type: 'inputField',
        object: `chatAmumamum_輸入${messageInput}`,
        id: 'speedDial_chatAmumamum',
      }, true, userStudentId || '', setTempStudentRecords)
    }
  }, [messageInput]);

  // 送出訊息
  useEffect(() => {
    if (isSubmitMessage && userStudentId && messageInput != '') {
      // 檢測送出訊息紀錄
      handleCustomRecord({
        action: 'click',
        type: 'button',
        object: `submitChat_${messageInput}`,
        id: 'speedDial_submitChat',
      }, false, userStudentId || '', setTempStudentRecords)

      const formattedTime = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      // 新增自己送出的訊息
      setMessages(prevState => {
        const newMessage: IMessages = {
          time: formattedTime,
          name: name,
          studentId: userStudentId,
          message: messageInput,
        }
        return [...prevState, newMessage]
      })
      // 將訊息送出給 Chat
      API_chatWithAmumAmum(messageInput, taskId).then(response => {
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
    // 滑到最下方
    if (messageBottomRef.current) messageBottomRef.current.scrollIntoView({behavior: "smooth"});
    if (chatContainerRef.current) previousScrollHeightRef.current = chatContainerRef.current.scrollHeight
  }, [isSubmitMessage, openChatRoom]);

  // 初始訊息讀取
  useEffect(() => {
    fetchMessageHistory()
  }, [])

  return (
    <div
      className="overflow-hidden flex flex-col justify-start min-w-[24rem] bg-stamindTask-white-200 rounded-xl shadow-lg shadow-stamindTask-primary-blue-600 animate-tooltipSlideIn">
      <div className='flex justify-between bg-stamindTask-black-850 p-3 gap-x-2 h-[7vh]'>
        <div className='flex items-center gap-x-2'>
          <ImageComponent
            src={`${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/img/logo.PNG`} alt='logo'
            width='36'/>
          <Typography variant="h5" color='blue' textGradient placeholder={undefined}>AmumAmum 助理</Typography>
        </div>
        <IconButton
          variant="text"
          color='white'
          placeholder={undefined}
          onClick={() => setOpenChatRoom(false)}
          data-action='click'
          data-type='button'
          data-object='closeChatRoom'
          data-id='speedDial_closeChatRoom'
        >
          <XMarkIcon className='h-5 w-5 color-white pointer-events-none'/>
        </IconButton>
      </div>
      <div className='flex flex-col justify-between h-[85vh]'>
        <div ref={chatContainerRef} onScroll={handleScrollToChatContainerTop} className='overflow-scroll h-[92%] my-2'>
          <div className='flex flex-col h-full px-3'>
            {
              messages.length > 0 &&
              isMessageEnded &&
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
                  <div className={isUserOrOther ? 'self-end text-right text-sm' : 'self-start text-left text-sm'}
                       key={i}>
                    <MessageContentComponent
                      type={isUserOrOther ? 'User' : 'Other'}
                      message={message}
                      studentId={studentId}
                      time={time}
                      name={name}
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
                    message={`## ${THINKING_MESSAGES[currentMessageIndex]}  \n已思考 ${thinkingSeconds} 秒`}
                    studentId={''}
                    time={''}
                    name={''}
                />
            }
            <div ref={messageBottomRef}></div>
          </div>
        </div>
        <div className="relative flex w-full max-w-[24rem] h-[8%]">
          <TextAreaComponent messageInput={messageInput}
                             setMessageInput={setMessageInput}
                             setIsSubmitMessage={setIsSubmitMessage}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatRoomComponent;
