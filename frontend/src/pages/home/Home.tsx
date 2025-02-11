// style

// API

// components
import NavBarComponent from "./components/NavBar"
import TaskAreaComponent from './components/TaskArea'

// interface
import {ISettingAlertLogAndLoading} from "../../utils/interface/alertLog";

interface IHomeProps {
  auth: false | 'STUDENT' | 'TEACHER'
  name: string
  studentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const Home = (props: IHomeProps) => {
  const {auth, name, studentId, settingAlertLogAndLoading} = props

  return (
    <div className="animate-fadeIn">
      <NavBarComponent auth={auth} name={name} studentId={studentId}
                       settingAlertLogAndLoading={settingAlertLogAndLoading}/>
      <div className='h-[56rem] bg-gradient-to-t from-white to-transparent mix-blend-soft-light'>
        <TaskAreaComponent auth={auth} studentId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
      </div>
    </div>
  )

}

export default Home