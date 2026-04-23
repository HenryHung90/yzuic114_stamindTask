import {Rnd} from "react-rnd"
import React, {useEffect, useState} from "react"
// style
// API
import {
  API_getProcessHintReply,
  API_getStudentTaskProcessCode,
  API_saveProcessHintReply,
  API_saveStudentTaskProcessCode
} from "../../../utils/API/API_StudentTaskProcess";
import {API_getProcessHint} from "../../../utils/API/API_ProcessHint";
import {handleCustomRecord} from "../../../utils/listener/action";

// components
import TabSelectorComponent from "../../../components/TabSelector/TabSelector";
import CodeEditorComponent from "../../../components/CodeEditor/CodeEditor";
import IframeShowerComponent from "../../../components/IframeShower/IframeShower";
import MarkDownTextComponent from "../../../components/MarkDownText/MarkDownText";
import InsertChatRoomComponent from "../../../components/ChatRoom/InsertChatRoom";
// interface
import {ITaskProcessHint, ITaskProcessProps} from "../../../utils/interface/Task";
import {Button, IconButton, Textarea, Typography} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {EGroupType} from "../../../utils/functions/common";
import TargetComponent from "./Target";

export enum LANGUAGE_TYPE {
  HTML = 'html',
  CSS = 'css',
  JS = 'javascript',
  TARGET = '任務目標'
}

export enum CODE_STATUS {
  SYNC = 'sync',
  ASYNC = 'async',
  UPLOADING = 'uploading',
  BAD = 'bad',
}


const ProcessComponent = (props: ITaskProcessProps) => {
  const {taskId, name, groupType, selectNode, studentId, setTempStudentRecords, settingAlertLogAndLoading} = props

  const [activeTab, setActiveTab] = useState<LANGUAGE_TYPE>(LANGUAGE_TYPE.HTML)
  const [htmlCode, setHtmlCode] = useState<string>("")
  const [cssCode, setCssCode] = useState<string>("")
  const [jsCode, setJsCode] = useState<string>("")
  const [processHintList, setProcessHintList] = useState<Array<ITaskProcessHint>>([])
  const [processHintReplyList, setProcessHintReplyList] = useState<Array<string>>([])

  const [openIframe, setOpenIframe] = useState<boolean>(false)
  const [openProcessHint, setOpenProcessHint] = useState<boolean>(false)

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(65)

  // 修改實作提示回覆部分
  const handleChangeProcessHintReply = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, hintTitle: string) => {
    setProcessHintReplyList(prevState => {
      const updateList = [...prevState]
      updateList[index] = e.target.value
      return updateList
    })
    // 紀錄回應的操作
    handleCustomRecord({
        action: 'input',
        type: 'inputField',
        object: `changeProcessHintReply_實作提示回應「${hintTitle}」更改為 ${e.target.value}`,
        id: `task_changeProcessHintReply`
      },
      true,
      studentId || '',
      setTempStudentRecords
    )
  }
  // 儲存實作提示回應
  const saveProcessHintReply = () => {
    API_saveProcessHintReply(taskId || '', selectNode.key, processHintReplyList).then(response => {

    })
  }

  // 儲存狀態
  const [codeStatus, setCodeStatus] = useState<CODE_STATUS>(CODE_STATUS.SYNC)
  // 程式儲存
  const handleSaveStudentCode = () => {
    setCodeStatus(CODE_STATUS.UPLOADING)
    API_saveStudentTaskProcessCode(taskId || '', htmlCode, cssCode, jsCode).then(response => {
      response.message === 'success' ? setCodeStatus(CODE_STATUS.SYNC) : setCodeStatus(CODE_STATUS.BAD)
    })
  }
  useEffect(() => {
    setCodeStatus(CODE_STATUS.ASYNC)
  }, [htmlCode, cssCode, jsCode])
  // 選擇當前顯示的程式碼內容
  const selectCodeType = () => {
    switch (activeTab) {
      case LANGUAGE_TYPE.HTML:
        return htmlCode
      case LANGUAGE_TYPE.CSS:
        return cssCode
      case LANGUAGE_TYPE.JS:
        return jsCode
    }
  }
  // 處理程式碼儲存
  const handleCodeChange = (value: string | undefined) => {
    switch (activeTab) {
      case LANGUAGE_TYPE.HTML:
        setHtmlCode(value ?? '')
        break
      case LANGUAGE_TYPE.CSS:
        setCssCode(value ?? '')
        break
      case LANGUAGE_TYPE.JS:
        setJsCode(value ?? '')
        break
    }
  }

  // 取得已儲存內容
  useEffect(() => {
    const fetchProcessCode = () => {
      API_getStudentTaskProcessCode(taskId || '').then(response => {
        setHtmlCode(response.data.html_code)
        setCssCode(response.data.css_code)
        setJsCode(response.data.js_code)
        setCodeStatus(CODE_STATUS.SYNC)
      })
    }
    // 取得 Process hint
    const fetchProcessHint = (fetchReply: (hintLength: number) => void) => {
      API_getProcessHint(taskId || '').then(response => {
        const processHint = response.data.process_hint_list[selectNode.key]
        // 若沒有其他提示則使用第一組的hint
        if (processHint) setProcessHintList(processHint)
        else setProcessHintList(response.data.process_hint_list[0] ?? [])
        fetchReply(processHint.length ?? 1)
      })
    }
    // 取得 Process hint reply
    const fetchProcessHintReply = (hintLength: number) => {
      API_getProcessHintReply(taskId || '').then(response => {
        const processHintReply = response.data.process_hint_reply_list[selectNode.key]
        setProcessHintReplyList(processHintReply ?? new Array(hintLength).fill(""))
      })
    }

    fetchProcessCode()
    fetchProcessHint(fetchProcessHintReply)
  }, []);

  // 偵測 Keydown 事件同時紀錄
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!studentId) return
    if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
      e.preventDefault()
      saveProcessHintReply()
      // 紀錄儲存 Code
      handleCustomRecord({
          action: 'click',
          type: 'button',
          object: 'saveProcessHintReply',
          id: 'task_saveProcessHintReply'
        },
        false,
        studentId,
        setTempStudentRecords
      )
    }
  }

  const handleDragStart = () => {
    document.body.style.cursor = 'col-resize'
    const handleDrag = (e: MouseEvent) => {
      const containerWidth = document.querySelector('.flex.gap-x-4')?.clientWidth || 0
      if (containerWidth === 0) return

      let newWidthPercent = Math.min(Math.max(20, (e.clientX / containerWidth) * 97), 90)
      if (newWidthPercent > 65) newWidthPercent = 65
      if (newWidthPercent < 20) newWidthPercent = 20
      setLeftPanelWidth(newWidthPercent)
    }
    const handleDragEnd = () => {
      document.body.style.cursor = 'default'
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
  }

  return (
    <>
      {
        openIframe && <div
              className='absolute w-full h-full z-[10002] bg-opacity-50 pointer-events-none animate-tooltipSlideIn'>
              <IframeShowerComponent htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} setOpenIframe={setOpenIframe}/>
          </div>
      }
      {
        openProcessHint && <div
              className='absolute w-full h-full z-[10002] bg-opacity-50 pointer-events-none animate-tooltipSlideIn'>
              <Rnd
                  default={{
                    x: 0,
                    y: 0,
                    width: window.innerWidth * 0.5,
                    height: window.innerHeight * 0.3,
                  }}
                  bounds="parent"
                  className='px-10 py-3 text-stamindTask-black-850 pointer-events-auto rounded-xl bg-stamindTask-white-200'
                  cancel=".no-drag"
              >
                  <div className='flex flex-col gap-y-4 h-full overflow-scroll' onKeyDown={handleKeyDown}>
                    {processHintList.map(({title, description}, index) => (
                      <div key={index}
                           className='flex flex-col min-h-22 p-4 gap-y-3 border-[1px] border-stamindTask-black-600 bg-stamindTask-white-000 rounded-2xl no-drag cursor-default'>
                        <h5
                          className='text-[1.2rem]'
                          data-action='click'
                          data-type='text'
                          data-object='processHintTitle'
                          data-id='task_processHintTitle'
                        >💡{title}</h5>
                        <p
                          data-action='click'
                          data-type='text'
                          data-object='processHintDescription'
                          data-id='task_processHintDescription'
                        >
                          <MarkDownTextComponent text={description}/>
                        </p>
                        <div>
                          <Typography variant='h6' placeholder={undefined}>引導問題回應</Typography>
                          <Textarea
                            variant='outlined'
                            label="反思回覆"
                            rows={5}
                            value={processHintReplyList[index]}
                            onChange={(e) => handleChangeProcessHintReply(e, index, title)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='absolute right-1 top-1'>
                      <div className='flex flex-col gap-y-2 justify-center items-center'>
                          <IconButton
                              variant="text"
                              placeholder={undefined}
                              onClick={() => {
                                setOpenProcessHint(false)
                                saveProcessHintReply()
                              }}
                          >
                              <XMarkIcon className='h-5 w-5 color-black'/>
                          </IconButton>
                          <Button
                              color='green'
                              size='sm'
                              placeholder={undefined}
                              onClick={saveProcessHintReply}
                          >
                              💾
                          </Button>
                      </div>
                  </div>
              </Rnd>
          </div>
      }
      <div className='flex gap-x-4'>
        <div className='relative w-[80%] h-[80vh] rounded-xl overflow-hidden' style={{width: `${leftPanelWidth}%`}}>
          <TabSelectorComponent tabData={LANGUAGE_TYPE} activeTab={activeTab} setActiveTab={setActiveTab}/>
          {activeTab === LANGUAGE_TYPE.TARGET &&
              <div className='relative h-[100%] overflow-y-auto'>
                  <TargetComponent taskId={taskId} selectNode={selectNode} groupType={groupType}
                                   studentId={studentId}
                                   setTempStudentRecords={setTempStudentRecords}
                                   settingAlertLogAndLoading={settingAlertLogAndLoading}/>
              </div>
          }
          {activeTab !== LANGUAGE_TYPE.TARGET && <CodeEditorComponent
              codeStatus={codeStatus}
              language={activeTab}
              value={selectCodeType()}
              onChangeFunction={handleCodeChange}
              handleSaveStudentCode={handleSaveStudentCode}
              groupType={groupType}
              openIframe={openIframe}
              setOpenIframe={setOpenIframe}
              openProcessHint={openProcessHint}
              setOpenProcessHint={setOpenProcessHint}
              studentId={studentId}
              setTempStudentRecords={setTempStudentRecords}
          />}

        </div>
        <div
          className="w-2 h-[80vh] cursor-col-resize bg-gray-300 hover:bg-blue-400 transition-colors duration-200 active:bg-blue-600"
          onMouseDown={handleDragStart}
        ></div>
        <div className="flex-1 overflow-hidden">
          <InsertChatRoomComponent name={name ?? ''} taskId={taskId ?? ''} userStudentId={studentId}
                                   groupType={groupType ?? EGroupType.EXPERIMENTAL}/>
        </div>
      </div>
    </>
  )
}

export default ProcessComponent
