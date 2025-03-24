import React, {useState, useEffect, useRef} from "react";
import {Rnd} from "react-rnd";

// style
import {IconButton, Button, Spinner} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/solid";

// API
import {API_saveStudentNotes} from "../../utils/API/API_StudentNotes";

// components
import NotesComponent from "../Notes/Notes";

// interface
interface NoteBookProps {
  noteContent: Array<any>
  setNoteContent: React.Dispatch<React.SetStateAction<Array<any>>>
  setOpenNoteBook: React.Dispatch<React.SetStateAction<boolean>>;
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
  const {noteContent, setNoteContent, setOpenNoteBook} = props

  const [noteStatus, setNoteStatus] = useState<'sync' | 'uploading' | 'bad' | 'async'>('sync')

  const saveStudentNote = async () => {
    setNoteStatus('uploading')

    API_saveStudentNotes(noteContent).then(response => {
      response.message === 'success' ? setNoteStatus('sync') : setNoteStatus('bad')
    })
  }

  const handleSaveStudentNote = () => saveStudentNote()

  useEffect(() => {
    setNoteStatus('async')
  }, [noteContent]);

  const savingAreaRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey && e.key === 's') || (e.ctrlKey && e.key === 's')) {
        e.preventDefault()
        saveStudentNote()
      }
    }
    savingAreaRef.current?.addEventListener('keydown', handleKeyDown)
    return () => {
      savingAreaRef.current?.removeEventListener('keydown', handleKeyDown)
    }
  })


  return (
    <div
      className="relative flex flex-col justify-between w-[100vw] h-[100vh] rounded-xl animate-tooltipSlideIn">
      <Rnd
        default={{
          x: window.innerWidth * 0.5,
          y: 0,
          width: window.innerWidth * 0.3,
          height: 'auto',
        }}
        bounds="parent"
        className='pointer-events-auto'
      >
        <div ref={savingAreaRef}
             className='overflow-scroll rounded-xl text-stamindTask-white-000 bg-[#191C1C]'>
          <NotesComponent noteContent={noteContent} setNoteContent={setNoteContent}/>
          <div className='absolute flex gap-x-5 items-center right-1 top-1'>
            <SavingStatusComponent status={noteStatus}/>
            <div>
              <Button
                color='green'
                placeholder={undefined}
                onClick={handleSaveStudentNote}
              >
                💾
              </Button>
              <IconButton
                variant="text"
                placeholder={undefined}
                color='white'
                onClick={() => setOpenNoteBook(false)}
              >
                <XMarkIcon className='h-5 w-5 color-white'/>
              </IconButton>
            </div>
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export default NoteBookComponent