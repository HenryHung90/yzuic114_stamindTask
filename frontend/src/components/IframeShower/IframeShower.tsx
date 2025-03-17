import {Rnd} from "react-rnd";
import {IconButton, Typography} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";
import React from "react";
// style

// API

// components

// interface
interface IIframeShowerProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  setOpenIframe: React.Dispatch<React.SetStateAction<boolean>>
}

const IframeShowerComponent = (props: IIframeShowerProps) => {
  const {htmlCode, cssCode, jsCode, setOpenIframe} = props
  // 動態生成完整的 HTML 文件內容
  const generateSrcDoc = () => {
    return `
        ${htmlCode}
        <style>${cssCode}</style>
        <script>${jsCode}</script>
      `;
  };

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: window.innerWidth * 0.5,
        height: window.innerHeight * 0.3,
      }}
      bounds="parent"
      className='p-1 pointer-events-auto overflow-scroll rounded-xl bg-amber-100 hover:bg-amber-400'
    >
      <Typography placeholder={undefined} variant='paragraph' className='p-2 font-bold'>黃條可以拖動頁面，未 Focus
        在此預覽畫面時會降低該畫面的運行效能</Typography>
      <iframe
        srcDoc={generateSrcDoc()}
        title="Live Preview"
        sandbox="allow-scripts allow-modals"
        style={{
          width: "100%",
          height: "87%",
          border: "none",
          background: 'white',
          borderRadius: '0 0 5px 5px'
        }}
      />
      <div className='absolute right-3 top-1'>
        <IconButton
          variant="text"
          placeholder={undefined}
          onClick={() => setOpenIframe(false)}
        >
          <XMarkIcon className='h-5 w-5 color-black'/>
        </IconButton>
      </div>
    </Rnd>
  )
}

export default IframeShowerComponent