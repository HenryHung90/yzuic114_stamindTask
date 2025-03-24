import {useEffect, useState} from "react";
// style
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilSquareIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";

// API

// components
import ChatRoomComponent from '../ChatRoom/ChatRoom'
import TextBookComponent from "../TextBook/TextBook"
import NoteBookComponent from "../NoteBook/NoteBook"
import {API_getStudentNotes} from "../../utils/API/API_StudentNotes";

// interface
interface SpeedDialProps {
  name: string
  studentId: string | undefined
  taskId: string
  selectNode: { key: number, category: string, text: string }
}

const SpeedDialComponent = (props: SpeedDialProps) => {
  const {name, studentId, taskId, selectNode} = props

  const [openChatRoom, setOpenChatRoom] = useState<boolean>(false)
  const [openTextBook, setOpenTextBook] = useState<boolean>(false)
  const [openNoteBook, setOpenNoteBook] = useState<boolean>(false)

  const [noteContent, setNoteContent] = useState<Array<any>>([])

  useEffect(() => {
    const fetchNoteContent = async () => {
      API_getStudentNotes().then(response => {
        if (response.data.student_note !== 'empty') setNoteContent(response.data.student_note[0])
      })
    }
    fetchNoteContent()
  }, []);


  return (
    <div className="flex items-end justify-end fixed w-screen h-screen z-[10001] pointer-events-none">
      <div className="absolute bottom-5 right-5 pointer-events-auto">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full pointer-events-auto" placeholder={undefined}>
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45"/>
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent placeholder={undefined}>
            <SpeedDialAction
              className={openTextBook ? 'bg-stamindTask-decoration-primary-1' : ''}
              onClick={() => setOpenTextBook(!openTextBook)}
              placeholder={undefined}
            >
              <DocumentTextIcon className='h-5 w-5'/>
              <Typography
                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                variant='small'
                color='white'
                placeholder={undefined}
              >
                階段{selectNode.key < 0 ? selectNode.key + 1 : ''}教材
              </Typography>
            </SpeedDialAction>
            <SpeedDialAction
              className={openNoteBook ? 'bg-stamindTask-decoration-primary-1' : ''}
              onClick={() => setOpenNoteBook(!openNoteBook)}
              placeholder={undefined}
            >
              <PencilSquareIcon className='h-5 w-5'/>
              <Typography
                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                variant='small'
                color='white'
                placeholder={undefined}
              >
                筆記
              </Typography>
            </SpeedDialAction>
            <SpeedDialAction
              className={openChatRoom ? 'bg-stamindTask-decoration-primary-1' : ''}
              onClick={() => setOpenChatRoom(!openChatRoom)}
              placeholder={undefined}
            >
              <img src='/files/img/logo.PNG' height='24px' width='24px'/>
              <Typography
                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                variant='small'
                color='white'
                placeholder={undefined}

              >
                ChatAmum
              </Typography>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>
      </div>
      <div
        className={`opacity-50 hover:opacity-100 duration-500 absolute bottom-5 right-20 pointer-events-auto ${!openChatRoom && 'hidden'}`}>
        <ChatRoomComponent name={name} userStudentId={studentId} setOpenChatRoom={setOpenChatRoom}/>
      </div>
      <div
        className={`absolute top-0 left-0 duration-500  ${!openTextBook && 'hidden'}`}>
        <TextBookComponent taskId={taskId} selectNode={selectNode} setOpenTextBook={setOpenTextBook}/>
      </div>
      <div
        className={`absolute top-0 left-0 duration-500  ${!openNoteBook && 'hidden'}`}>
        <NoteBookComponent noteContent={noteContent} setNoteContent={setNoteContent}
                           setOpenNoteBook={setOpenNoteBook}/>
      </div>
    </div>
  )
}

export default SpeedDialComponent
