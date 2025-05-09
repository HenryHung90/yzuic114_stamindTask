import React, {useEffect, useState} from "react";
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
  DocumentTextIcon,
  ArrowLeftStartOnRectangleIcon
} from "@heroicons/react/24/solid";

// API
import {handleCustomRecord, IStudentRecords} from "../../utils/listener/action";

// components
import ChatRoomComponent from '../ChatRoom/ChatRoom'
import TextBookComponent from "../TextBook/TextBook"
import NoteBookComponent from "../NoteBook/NoteBook"
import {useNavigate} from "react-router-dom";

// interface
interface SpeedDialProps {
  name: string
  studentId: string | undefined
  taskId: string
  selectNode: { key: number, category: string, text: string }
  setTempStudentRecords?: React.Dispatch<React.SetStateAction<Array<IStudentRecords>>>;
}

const SpeedDialComponent = (props: SpeedDialProps) => {
  const {name, studentId, taskId, selectNode, setTempStudentRecords} = props
  const NavLocation = useNavigate()

  const [openChatRoom, setOpenChatRoom] = useState<boolean>(false)
  const [openTextBook, setOpenTextBook] = useState<boolean>(false)
  const [openNoteBook, setOpenNoteBook] = useState<boolean>(false)

  // 檢測進入各階段 紀錄時間行為（特殊處理）
  const [startTime, setStartTime] = useState<number>(0)
  useEffect(() => {
    if (openTextBook) {
      setStartTime(Date.now())
      handleCustomRecord({
        action: 'click',
        type: 'button',
        object: 'openTextBook',
        id: 'speedDial_openTextBook'
      }, false, studentId || '', setTempStudentRecords)
    } else if (!openTextBook && startTime) {
      const timer = Math.floor((Date.now() - startTime) / 1000).toString()
      handleCustomRecord({
        action: 'click',
        type: 'button',
        timer: timer,
        object: 'closeTextBook',
        id: 'speedDial_closeTextBook'
      }, false, studentId || '', setTempStudentRecords)
      setStartTime(0)
    }
  }, [openTextBook]);

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
              <DocumentTextIcon className='h-5 w-5 pointer-events-none'/>
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
              data-action='click'
              data-type='button'
              data-object={openNoteBook ? 'closeNoteBook' : 'openNoteBook'}
              data-id={openNoteBook ? 'speedDial_closeNoteBook' : 'speedDial_openNoteBook'}
            >
              <PencilSquareIcon className='h-5 w-5 pointer-events-none'/>
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
              data-action='click'
              data-type='button'
              data-object={openChatRoom ? 'closeChatRoom' : 'openChatRoom'}
              data-id={openChatRoom ? 'speedDial_closeChatRoom' : 'speedDial_openChatRoom'}
            >
              <img src={`/${import.meta.env.VITE_APP_FILE_ROUTE}/img/logo.PNG`} height='24px' width='24px'
                   className='pointer-events-none'/>
              <Typography
                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                variant='small'
                color='white'
                placeholder={undefined}

              >
                ChatAmum
              </Typography>
            </SpeedDialAction>
            <SpeedDialAction
              onClick={() => NavLocation('/home')}
              placeholder={undefined}
              data-action='click'
              data-type='button'
              data-object='leaveTask'
              data-id='speedDial_leaveTask'
            >
              <ArrowLeftStartOnRectangleIcon className='h-5 w-5 pointer-events-none'/>
              <Typography
                className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                variant='small'
                color='white'
                placeholder={undefined}
              >
                離開
              </Typography>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>
      </div>
      <div
        className={`opacity-50 hover:opacity-100 duration-500 absolute bottom-5 right-20 pointer-events-auto ${!openChatRoom && 'hidden'}`}>
        <ChatRoomComponent name={name} taskId={taskId} userStudentId={studentId} openChatRoom={openChatRoom}
                           setTempStudentRecords={setTempStudentRecords}
                           setOpenChatRoom={setOpenChatRoom}/>
      </div>
      <div
        className="absolute top-0 left-0 duration-500">
        {openTextBook && <TextBookComponent taskId={taskId} selectNode={selectNode} setOpenTextBook={setOpenTextBook}/>}
      </div>
      <div
        className={`absolute top-0 left-0 duration-500  ${!openNoteBook && 'hidden'}`}>
        <NoteBookComponent studentId={studentId || ''} setOpenNoteBook={setOpenNoteBook}
                           setTempStudentRecords={setTempStudentRecords}/>
      </div>
    </div>
  )
}

export default SpeedDialComponent
