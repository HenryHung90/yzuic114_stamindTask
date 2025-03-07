import {useState} from "react";
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

// interface
interface SpeedDialProps {
  name: string
  studentId: string | undefined
  selectNode: { key: number, category: string, text: string }
  handleClickTextBookButton?: () => void
}

const SpeedDialComponent = (props: SpeedDialProps) => {
  const {name, studentId, selectNode} = props

  const [openChatRoom, setOpenChatRoom] = useState<boolean>(true)

  return (
    <div className="flex items-end justify-end fixed w-screen h-screen z-[10000] pointer-events-none">
      <div className="absolute bottom-5 right-5 pointer-events-auto">
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full pointer-events-auto" placeholder={undefined}>
              <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45"/>
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent placeholder={undefined}>
            {selectNode.category === 'Process' &&
                <SpeedDialAction placeholder={undefined}>
                    <DocumentTextIcon className='h-5 w-5'/>
                    <Typography
                        className="absolute top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal"
                        variant='small'
                        color='white'
                        placeholder={undefined}
                    >
                        教材
                    </Typography>
                </SpeedDialAction>
            }
            <SpeedDialAction placeholder={undefined}>
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
            <SpeedDialAction onClick={()=>setOpenChatRoom(true)} placeholder={undefined}>
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
      <div className="absolute bottom-5 right-5 pointer-events-auto">
        {openChatRoom && <ChatRoomComponent name={name} userStudentId={studentId} setOpenChatRoom={setOpenChatRoom} />}
      </div>
    </div>
  )
}

export default SpeedDialComponent
