import {useEffect, useRef, useState} from "react";
// style

// API
import {
  API_getStudentTaskProcessCode,
  API_saveStudentTaskProcessCode
} from "../../../utils/API/API_StudentTaskProcessCode";

// components
import TabSelectorComponent from "../../../components/TabSelector/TabSelector";
import CodeEditorComponent from "../../../components/CodeEditor/CodeEditor";
import IframeShowerComponent from "../../../components/IframeShower/IframeShower";

// interface
import {ITaskProcessProps} from "../../../utils/interface/Task";

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
  const {taskId, studentId, selectNode, settingAlertLogAndLoading} = props

  const [activeTab, setActiveTab] = useState<LANGUAGE_TYPE>(LANGUAGE_TYPE.HTML)
  const [htmlCode, setHtmlCode] = useState<string>("21")
  const [cssCode, setCssCode] = useState<string>("312")
  const [jsCode, setJsCode] = useState<string>("41241")

  const [openIframe, setOpenIframe] = useState<boolean>(false)

  // 儲存狀態
  const [codeStatus, setCodeStatus] = useState<CODE_STATUS>(CODE_STATUS.SYNC)
  // 程式儲存
  const handleSaveStudentCode = () => {
    setCodeStatus(CODE_STATUS.UPLOADING)
    console.log(htmlCode, cssCode, jsCode)
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


  const savingAreaRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
        e.preventDefault()
        handleSaveStudentCode()
      }
    }
    savingAreaRef.current?.addEventListener('keydown', handleKeyDown)

    return () => {
      savingAreaRef.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [codeStatus]);

  // 取得已儲存內容
  useEffect(() => {
    const fetchProcessCode = async () => {
      await API_getStudentTaskProcessCode(taskId || '').then(response => {
        setHtmlCode(response.data.html_code)
        setCssCode(response.data.css_code)
        setJsCode(response.data.js_code)
        setCodeStatus(CODE_STATUS.SYNC)
      })
    }
    fetchProcessCode()
  }, []);


  return (
    <>
      {
        openIframe && <div
              className='absolute -top-[10vh] -left-[12.5vw] w-[100vw] h-[100vh] z-[10002] bg-opacity-50 pointer-events-none animate-tooltipSlideIn'>
              <IframeShowerComponent htmlCode={htmlCode} cssCode={cssCode} jsCode={jsCode} setOpenIframe={setOpenIframe}/>
          </div>
      }
      <div ref={savingAreaRef} className='relative h-[75vh] rounded-xl overflow-hidden'>
        <TabSelectorComponent tabData={LANGUAGE_TYPE} activeTab={activeTab} setActiveTab={setActiveTab}/>
        <CodeEditorComponent
          codeStatus={codeStatus}
          language={activeTab}
          value={selectCodeType()}
          onChangeFunction={handleCodeChange}
          handleSaveStudentCode={handleSaveStudentCode}
          openIframe={openIframe}
          setOpenIframe={setOpenIframe}
        />
      </div>
    </>
  )
}

export default ProcessComponent
