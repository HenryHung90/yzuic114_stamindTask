import React, {useState, useEffect, useRef} from "react";
import {Rnd} from "react-rnd";

// style
import {IconButton, Button, Spinner} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

// API
import {API_getStudentNotes, API_saveStudentNotes} from "../../utils/API/API_StudentNotes";
import {handleCustomRecord, IStudentRecords} from "../../utils/listener/action";

// components
import NotesComponent from "../Notes/Notes";

// interface
interface NoteBookProps {
  studentId: string
  setOpenNoteBook: React.Dispatch<React.SetStateAction<boolean>>
  setTempStudentRecords?: React.Dispatch<React.SetStateAction<Array<IStudentRecords>>>
}

const SavingStatusComponent = (props: { status: 'sync' | 'uploading' | 'bad' | 'async' }) => {
  const {status} = props
  switch (status) {
    case 'sync':
      return '🟢'
    case 'async':
      return '🟠'
    case 'uploading':
      return '🟡'
    case 'bad':
      return '🔴'
  }
}

const NoteBookComponent = (props: NoteBookProps) => {
  const {studentId, setOpenNoteBook, setTempStudentRecords} = props

  const [noteStatus, setNoteStatus] = useState<'sync' | 'uploading' | 'bad' | 'async'>('sync')
  const [noteContent, setNoteContent] = useState<Array<any>>([])

  // 取得筆記紀錄
  useEffect(() => {
    const fetchNoteContent = () => {
      API_getStudentNotes().then(response => {
        if (response.data.student_note !== 'empty') setNoteContent(response.data.student_note[0] ?? [{}])
      })
    }
    fetchNoteContent()
  }, []);

  const saveStudentNote = () => {
    setNoteStatus('uploading')
    API_saveStudentNotes(noteContent).then(response => {
      response.message === 'success' ? setNoteStatus('sync') : setNoteStatus('bad')
    })
    handleCustomRecord({
      action: 'click',
      type: 'button',
      object: 'saveNoteBook',
      id: 'speedDial_saveNoteBook',
    }, false, studentId, setTempStudentRecords)
  }


  useEffect(() => {
    setNoteStatus('async')
  }, [noteContent]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
      e.preventDefault()
      saveStudentNote()
    }
  }


  return (
    <div
      className="relative flex flex-col justify-between w-[100vw] h-[100vh] rounded-xl animate-tooltipSlideIn">
      <Rnd
        default={{
          x: window.innerWidth * 0.3,
          y: 0,
          width: window.innerWidth * 0.3,
          height: 'auto',
        }}
        bounds="parent"
        className='pointer-events-auto overflow-hidden'
      >
        <div onKeyDown={handleKeyDown}
             className='h-full pointer-events-auto overflow-scroll rounded-xl text-stamindTask-white-000 bg-[#191C1C]'>
          <NotesComponent noteContent={noteContent} setNoteContent={setNoteContent}/>
          <div className='absolute flex gap-x-5 items-center right-1 top-1'>
            <SavingStatusComponent status={noteStatus}/>
            <div>
              <Button
                color='green'
                placeholder={undefined}
                onClick={saveStudentNote}
              >
                💾
              </Button>
              <IconButton
                variant="text"
                placeholder={undefined}
                color='white'
                onClick={() => setOpenNoteBook(false)}
                data-action='click'
                data-type='button'
                data-object='closeNoteBook'
                data-id='speedDial_closeNoteBook'
              >
                <XMarkIcon className='h-5 w-5 color-white pointer-events-none'/>
              </IconButton>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export default NoteBookComponent