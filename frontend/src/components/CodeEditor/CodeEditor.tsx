import React, {useState} from "react";
// style

// API

// components
import {Editor} from "@monaco-editor/react";
import {emmetCSS, emmetHTML, emmetJSX} from "emmet-monaco-es";
import FontSizeAdjustButtonComponent from "./FontSizeAdjustButton";
import SavingStatusButtonComponent from "./SavingStatusButton";
import {CODE_STATUS, LANGUAGE_TYPE} from "../../pages/task/components/Process";
import OpenIframeButtonComponent from "./OpenIframeButton";


// interface
interface ICodeEditorProps {
  codeStatus: CODE_STATUS
  language: LANGUAGE_TYPE
  value: string | undefined
  onChangeFunction: (value: string | undefined) => void
  handleSaveStudentCode: () => void
  openIframe: boolean
  setOpenIframe: React.Dispatch<React.SetStateAction<boolean>>
}

const CodeEditorComponent = (props: ICodeEditorProps) => {
  const {codeStatus, language, value, onChangeFunction, handleSaveStudentCode, openIframe, setOpenIframe} = props

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


  return (
    <div className='relative h-[100%]'>
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
      />
      <div
        className='absolute flex flex-col right-5 top-3 z-50 gap-y-4 text-right duration-500 opacity-50 hover:opacity-100'>
        <FontSizeAdjustButtonComponent fontSize={fontSize} increaseFontSize={increaseFontSize}
                                       decreaseFontSize={decreaseFontSize}/>
        <SavingStatusButtonComponent codeStatus={codeStatus} handleClickSave={handleSaveStudentCode}/>
        <OpenIframeButtonComponent openIframe={openIframe} setOpenIframe={setOpenIframe}/>
      </div>
    </div>
  )
}

export default CodeEditorComponent