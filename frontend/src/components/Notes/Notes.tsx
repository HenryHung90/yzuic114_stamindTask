// BlockNote
import {locales} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {BlockNoteView} from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {useCreateBlockNote} from "@blocknote/react";
import React from "react";
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
  const editor = useCreateBlockNote({
    ...( noteContent != null && noteContent.length > 0) && {initialContent: noteContent},
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
  });

  const handleNotesChange = () => {
    setNoteContent(editor.document)
  }

  return (
    <div className='w-full h-full px-3 my-10'>
      <BlockNoteView
        editor={editor}
        onChange={handleNotesChange}
        data-theming-css-demo
      />
    </div>
  )
}

export default NotesComponent