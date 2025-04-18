import {Rnd} from "react-rnd"
import React, {useEffect, useState} from "react"
// style

// API
import {
  API_getStudentTaskProcessCode,
  API_saveStudentTaskProcessCode
} from "../../../utils/API/API_StudentTaskProcessCode";
import {API_getProcessHint} from "../../../utils/API/API_ProcessHint";

// components
import TabSelectorComponent from "../../../components/TabSelector/TabSelector";
import CodeEditorComponent from "../../../components/CodeEditor/CodeEditor";
import IframeShowerComponent from "../../../components/IframeShower/IframeShower";

// interface
import {ITaskProcessHint, ITaskProcessProps} from "../../../utils/interface/Task";
import {IconButton} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

export enum LANGUAGE_TYPE {
  HTML = 'html',
  CSS = 'css',
  JS = 'javascript',
}

export enum CODE_STATUS {
  SYNC = 'sync',
  ASYNC = 'async',
  UPLOADING = 'uploading',
  BAD = 'bad',
}


const ProcessComponent = (props: ITaskProcessProps) => {
  const {taskId, groupType, selectNode, studentId, setTempStudentRecords} = props

  const [activeTab, setActiveTab] = useState<LANGUAGE_TYPE>(LANGUAGE_TYPE.HTML)
  const [htmlCode, setHtmlCode] = useState<string>("")
  const [cssCode, setCssCode] = useState<string>("")
  const [jsCode, setJsCode] = useState<string>("")
  const [processHintList, setProcessHintList] = useState<Array<ITaskProcessHint>>([])

  const [openIframe, setOpenIframe] = useState<boolean>(false)
  const [openProcessHint, setOpenProcessHint] = useState<boolean>(false)

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
    const fetchProcessHint = () => {
      API_getProcessHint(taskId || '').then(response => {
        const processHint = response.data.process_hint_list[selectNode.key]
        // 若沒有其他提示則使用第一組的hint
        if (processHint) setProcessHintList(processHint)
        else setProcessHintList(response.data.process_hint_list[0])
      })
    }

    fetchProcessCode()
    fetchProcessHint()
  }, []);


  return (
    <>
      {
        openIframe && <div
              className='absolute -top-[10vh] -left-[12.5vw] w-[100vw] h-[100vh] z-[10002] bg-opacity-50 pointer-events-none animate-tooltipSlideIn'>
              <IframeShowerComponent htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} setOpenIframe={setOpenIframe}/>
          </div>
      }
      {
        openProcessHint && <div
              className='absolute -top-[10vh] -left-[12.5vw] w-[100vw] h-[100vh] z-[10002] bg-opacity-50 pointer-events-none animate-tooltipSlideIn'>
              <Rnd
                  default={{
                    x: 0,
                    y: 0,
                    width: window.innerWidth * 0.5,
                    height: window.innerHeight * 0.3,
                  }}
                  bounds="parent"
                  className='p-10 text-stamindTask-black-850 pointer-events-auto overflow-scroll rounded-xl bg-stamindTask-white-200'
              >
                  <div className='flex flex-col gap-y-4'>
                    {processHintList.map(({title, description}, index) => (
                      <div key={index}
                           className='flex flex-col min-h-22 p-4 gap-y-3 border-[1px] border-stamindTask-black-600 rounded-2xl'>
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
                        >{description}</p>
                      </div>
                    ))}
                  </div>
                  <div className='absolute right-3 top-1'>
                      <IconButton
                          variant="text"
                          placeholder={undefined}
                          onClick={() => setOpenProcessHint(false)}
                      >
                          <XMarkIcon className='h-5 w-5 color-black'/>
                      </IconButton>
                  </div>
              </Rnd>
          </div>
      }
      <div className='relative h-[75vh] rounded-xl overflow-hidden'>
        <TabSelectorComponent tabData={LANGUAGE_TYPE} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <CodeEditorComponent
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
        />
      </div>
    </>
  )
}

export default ProcessComponent
