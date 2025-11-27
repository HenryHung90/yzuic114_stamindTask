import React, {useEffect, useRef, useState} from "react";
// style
import {
  IconButton,
  Typography
} from "@material-tailwind/react";
import {
  XMarkIcon,
} from "@heroicons/react/24/solid";

// API

// components
import TextAreaComponent from "./TextArea";
import MessageContentComponent from "./MessageContent";
import ChatMethodSelectorComponent, {ChatMethodType} from "./ChatMethodSelector";
import SideActionButtonsComponent from "./SideActionButtons";
import GraphDialogComponent from "./GraphDialog";

// interface
import {IMessages} from "../../utils/interface/chatRoom";
import {
  API_chatWithAmumAmum,
  API_codeDebugWithAmumAmum,
  API_specifyChatWithAmumAmum
} from "../../utils/API/API_ChatGPT";
import {API_getChatHistories} from "../../utils/API/API_ChatHistories";
import {handleCustomRecord, IStudentRecords} from "../../utils/listener/action";
import ImageComponent from "../Image/Image";

// 思考中的訊息集合
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

// 定義圖譜數據接口
interface IGraphData {
  nodes: Array<{
    id: number;
    label: string;
    color: string;
    size: number;
  }>;
  edges: Array<{
    id: string;
    from: number;
    to: number;
    label: string;
    color: string;
    width: number;
  }>;
}

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

  const [currentMethod, setCurrentMethod] = useState<ChatMethodType>('normal')

  // Graph Dialog 狀態
  const [openGraphDialog, setOpenGraphDialog] = useState<boolean>(false);
  const [graphData, setGraphData] = useState<IGraphData | null>(null);

  // 計算思考秒數
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
      sendMyMessage()
      if (currentMethod === "normal") {
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
      } else if (currentMethod === "code_debug") {
        API_codeDebugWithAmumAmum(messageInput, taskId).then(response => {
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
      } else {
        // 特殊功能
        API_specifyChatWithAmumAmum(messageInput, taskId, currentMethod).then(response => {
          setIsSubmitMessage(false)
        })
      }
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

  // 處理方法切換
  const handleMethodChange = (method: ChatMethodType) => {
    setCurrentMethod(method);
  };


  const handleGenerateKnowledgeGraph = (functionType: "code_debug" | "deep_learn" | "similar" | "next_step", findPrev: boolean = false) => {
    setIsSubmitMessage(true);
    API_specifyChatWithAmumAmum("", taskId, functionType, findPrev).then(response => {
      let graphData: any = null;
      if (functionType === 'deep_learn' && response.data?.recommendation_data?.recommendations?.deep_exploration?.[0]?.graph_data) {
        graphData = response.data.recommendation_data.recommendations.deep_exploration[0].graph_data;
      } else if (functionType === 'similar' && response.data?.recommendation_data?.recommendations?.related_knowledge?.[0].graph_data) {
        graphData = response.data.recommendation_data.recommendations.related_knowledge[0].graph_data;
      } else if (functionType === 'next_step' && response.data?.recommendation_data?.recommendations?.next_step?.[0].graph_data) {
        graphData = response.data.recommendation_data.recommendations.next_step[0].graph_data;
      } else {
        alert("該知識節點沒有辦法再繼續延伸，可能是因為：\n1. 已經到達知識的盡頭。\n2. 實體之間缺乏足夠的關聯。\n 將給您上一次知識圖譜。")
        if (!findPrev) handleGenerateKnowledgeGraph(functionType, true);
      }
      setGraphData(graphData);
      setOpenGraphDialog(true);
      setIsSubmitMessage(false);
    }).catch(error => {
      console.error(`${functionType} API error:`, error);
      setIsSubmitMessage(false);
    });
  }

  const sendMyMessage = () => {
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
        studentId: userStudentId || '',
        message: messageInput,
      }
      return [...prevState, newMessage]
    })
  }

  // 側邊按鈕處理函數
  const handleDeepLearnClick = () => {
    handleGenerateKnowledgeGraph('deep_learn');
  };

  const handleSimilarClick = () => {
    handleGenerateKnowledgeGraph('similar');
  };

  const handleNextStepClick = () => {
    handleGenerateKnowledgeGraph('next_step');
  };

  const handleGraphClick = () => {
    // 記錄點擊圖譜按鈕事件
    handleCustomRecord({
      action: 'click',
      type: 'button',
      object: 'openGraphInfo',
      id: 'speedDial_openGraphInfo',
    }, false, userStudentId || '', setTempStudentRecords);

    setOpenGraphDialog(true);
  };

  const handleGraphNodeClick = (nodeTitle: string) => {
    setMessageInput(`我想要繼續了解關於 ${nodeTitle} 的內容，請提供有關 ${nodeTitle} 的更多、更深入的資訊。`);
    setIsSubmitMessage(true)
  }

  const handleCloseGraphDialog = () => {
    setOpenGraphDialog(false);
    // 記錄關閉事件
    handleCustomRecord({
      action: 'click',
      type: 'button',
      object: 'closeGraphInfo',
      id: 'speedDial_closeGraphInfo',
    }, false, userStudentId || '', setTempStudentRecords);
  };

  return (
    <>
      <div
        className="overflow-hidden flex flex-col justify-start min-w-[24rem] bg-stamindTask-white-200 rounded-xl shadow-lg shadow-stamindTask-primary-blue-600 animate-tooltipSlideIn">
        <div className='flex justify-between bg-stamindTask-black-850 px-2 gap-x-2 h-[5vh]'>
          <SideActionButtonsComponent
            onDeepLearnClick={handleDeepLearnClick}
            onLightBulbClick={handleSimilarClick}
            onArrowRightClick={handleNextStepClick}
            onGraphClick={handleGraphClick}
          />
          <div className='flex items-center gap-x-2'>
            <ImageComponent
              src={`${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/img/logo.PNG`}
              alt='logo'
              width='36'/>
            <Typography variant="h5" color='blue' textGradient placeholder={undefined}>AmumAmum 助理</Typography>
          </div>
          <IconButton
            variant="text"
            color='white'
            ripple={false}
            placeholder={undefined}
            onClick={() => setOpenChatRoom(false)}
            className='mt-[2px] hover:bg-stamindTask-black-850'
            data-action='click'
            data-type='button'
            data-object='closeChatRoom'
            data-id='speedDial_closeChatRoom'
          >
            <XMarkIcon className='h-5 w-5 color-white pointer-events-none'/>
          </IconButton>
        </div>
        {/* Graph Dialog */}
        <GraphDialogComponent
          open={openGraphDialog}
          onClose={handleCloseGraphDialog}
          onClickNode={handleGraphNodeClick}
          taskId={taskId}
          graphData={graphData}
        />
        <div className='flex flex-col justify-between w-[90vw] h-[90vh]'>
          <div ref={chatContainerRef} onScroll={handleScrollToChatContainerTop}
               className='overflow-scroll w-full h-[95%] my-2'>
            <div className='flex flex-col h-full px-5'>
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
                        taskId={taskId}
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
                      taskId={taskId}
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
          <div className="relative flex w-full h-[6%]">
            <TextAreaComponent
              isSubmitMessage={isSubmitMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              setIsSubmitMessage={setIsSubmitMessage}
            />
          </div>

          <ChatMethodSelectorComponent
            currentMethod={currentMethod}
            onMethodChange={handleMethodChange}
          />
        </div>
      </div>
    </>
  )
}

export default ChatRoomComponent;
