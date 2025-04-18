import React, {useState} from "react";
// style

// API
import {handleCustomRecord, IStudentRecords} from "../../utils/listener/action";

// components
import {Editor} from "@monaco-editor/react";
import {emmetCSS, emmetHTML, emmetJSX} from "emmet-monaco-es";
import FontSizeAdjustButtonComponent from "./FontSizeAdjustButton";
import SavingStatusButtonComponent from "./SavingStatusButton";
import OpenPageButtonComponent from "./OpenPageButton";
import {CODE_STATUS, LANGUAGE_TYPE} from "../../pages/task/components/Process";
import {EGroupType} from "../../utils/functions/common";


// interface
interface ICodeEditorProps {
  codeStatus: CODE_STATUS
  language: LANGUAGE_TYPE
  value: string | undefined
  onChangeFunction: (value: string | undefined) => void
  handleSaveStudentCode: () => void
  groupType?: EGroupType
  openIframe: boolean
  setOpenIframe: React.Dispatch<React.SetStateAction<boolean>>
  openProcessHint: boolean
  setOpenProcessHint: React.Dispatch<React.SetStateAction<boolean>>
  studentId?: string
  setTempStudentRecords?: React.Dispatch<React.SetStateAction<Array<IStudentRecords>>>;
}

const CodeEditorComponent = (props: ICodeEditorProps) => {
  const {
    codeStatus,
    language,
    value,
    onChangeFunction,
    handleSaveStudentCode,
    groupType,
    openIframe,
    setOpenIframe,
    openProcessHint,
    setOpenProcessHint,
    studentId,
    setTempStudentRecords
  } = props

  // 調整字體大小
  const [fontSize, setFontSize] = useState<number>(14)
  const increaseFontSize = () => setFontSize((prev) => Math.min(26, prev + 2));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(8, prev - 2));

  // 加入 emmet
  const handleOnMounted = (editor: any) => {
    editor.focus()
    emmetHTML((window as any).monaco);
    emmetCSS((window as any).monaco);
    emmetJSX((window as any).monaco);
  }

  // 偵測 Keydown 事件同時紀錄
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!studentId) return
    if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
      e.preventDefault()
      handleSaveStudentCode()
      // 紀錄儲存 Code
      handleCustomRecord({
          action: 'click',
          type: 'button',
          object: 'processSave',
          id: 'task_processSave'
        },
        false,
        studentId,
        setTempStudentRecords
      )
    }
  }


  return (
    <div className='relative h-[100%]' onKeyDown={handleKeyDown}>
      <Editor
        height='100%'
        theme='vs-dark'
        value={value}
        onChange={onChangeFunction}
        onMount={handleOnMounted}
        language={language}
        options={{
          fontSize: fontSize,
          minimap: {
            enabled: false,
          },
        }}
        data-action='interact'
        data-type='inputField'
        data-object='processCodeEditor'
        data-id='task_processCodeEditor'
      />
      <div
        className='absolute flex flex-col right-5 top-3 z-50 gap-y-4 text-right duration-500 opacity-50 hover:opacity-100'>
        <FontSizeAdjustButtonComponent fontSize={fontSize} increaseFontSize={increaseFontSize}
                                       decreaseFontSize={decreaseFontSize}/>
        <SavingStatusButtonComponent codeStatus={codeStatus} handleClickSave={handleSaveStudentCode}/>
        <OpenPageButtonComponent
          title='預覽畫面'
          icon='🖥️'
          open={openIframe}
          setOpen={setOpenIframe}
          dataObject="Iframe"
        />
        {groupType && groupType === EGroupType.EXPERIMENTAL &&
            <OpenPageButtonComponent
                title='實作提示'
                icon='💡'
                open={openProcessHint}
                setOpen={setOpenProcessHint}
                dataObject="ProcessHint"
            />
        }
      </div>
    </div>
  )
}

export default CodeEditorComponent