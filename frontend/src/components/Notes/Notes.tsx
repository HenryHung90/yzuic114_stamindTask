// BlockNote
import {locales} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {useCreateBlockNote} from "@blocknote/react";
// style

// API

// components

// interface
interface NotesProps {
  noteContent: Array<any>
  setNoteContent: React.Dispatch<React.SetStateAction<Array<any>>>
}


const NotesComponent = (props: NotesProps) => {
  const {noteContent, setNoteContent} = props

  const locale = locales["en"];
  const editor = noteContent && noteContent.length > 0
    ? useCreateBlockNote({
      initialContent: noteContent,
      dictionary: {
        ...locale,
        placeholders: {
          ...locale.placeholders,
          // We override the empty document placeholder
          emptyDocument: "開始編輯您的筆記！",
          // We override the default placeholder
          default: "寫點什麼...",
          // We override the heading placeholder
          heading: "標題",
        },
      },
      domAttributes: {
        block: {"data-custom-attribute": "my-block"}, // 添加自訂屬性
      },
    }) : null;

  const handleCopy = (event: any) => {
    event.preventDefault();
    const selection = window.getSelection();
    if (selection && editor) {
      const docContent = editor.document; // 獲取整個文檔的 JSON 結構
      const selectedText = selection.toString(); // 獲取選中的文本
      let customCopyContent = "";
      // 遍歷文檔內容，找到包含選中文本的區塊
      docContent.forEach((block: any) => {
        if (block.type === "code" && block.content.some((node: any) => node.text.includes(selectedText))) {
          // 如果是 code block，保留多行格式
          customCopyContent += `\`\`\`\n${block.content.map((node: any) => node.text).join("\n")}\n\`\`\`\n`;
        } else if (block.content.some((node: any) => node.text.includes(selectedText))) {
          // 處理其他區塊
          customCopyContent += `${block.content.map((node: any) => node.text).join(" ")}\n\n`;
        }
      });

      // 將自定義內容放入剪貼板
      event.clipboardData?.setData("text/plain", customCopyContent.trim());
    }
  }

  const handleNotesChange = () => {
    if (editor) setNoteContent(editor.document)
  }

  return (
    <div className='w-full h-full px-3 my-10'>
      {editor && (
        <BlockNoteView
          onCopy={handleCopy}
          editor={editor}
          onChange={handleNotesChange}
          data-theming-css-demo
        />
      )}
    </div>
  )
}

export default NotesComponent