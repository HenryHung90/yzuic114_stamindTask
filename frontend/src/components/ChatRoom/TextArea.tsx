import React, {useEffect} from "react";
// style
import {
  IconButton,
  Textarea
} from "@material-tailwind/react";
// API

// components

// interface
interface ITextAreaProps {
  messageInput: string
  setMessageInput: React.Dispatch<React.SetStateAction<string>>
  setIsSubmitMessage: React.Dispatch<React.SetStateAction<boolean>>
}

const TextAreaComponent = (props: ITextAreaProps) => {
  const {messageInput, setMessageInput, setIsSubmitMessage} = props

  const handleSumbitMessage = () => {
    console.log(messageInput)
    setIsSubmitMessage(true)
  }
  const handleEnterKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSumbitMessage()
    }
  }

  return (
    <div className="flex w-full flex-row items-center gap-2 bg-gradient-to-r from-stamindTask-decoration-block p-2">
      <Textarea
        rows={1}
        resize={true}
        placeholder="請輸入訊息..."
        className="min-h-full !border-0 focus:border-transparent"
        containerProps={{
          className: "grid h-full",
        }}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={handleEnterKeyDown}
      />
      <div>
        <IconButton
          variant="text"
          className="rounded-full bg-stamindTask-black-600"
          onClick={handleSumbitMessage}
          aria-label="提交訊息"
          placeholder={undefined}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="lightblue"
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </IconButton>
      </div>
    </div>
  )
}

export default TextAreaComponent