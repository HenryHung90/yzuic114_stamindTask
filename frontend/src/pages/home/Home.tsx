// style

// API

// components
import NavBarComponent from "./components/NavBar"
import TaskAreaComponent from './components/TaskArea'

// interface
import {ISettingAlertLogAndLoading} from "../../utils/interface/alertLog";
import {EGroupType} from "../../utils/functions/common";

interface IHomeProps {
  auth: false | 'STUDENT' | 'TEACHER'
  name: string
  studentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
  groupType: EGroupType
}

const Home = (props: IHomeProps) => {
  const {auth, name, studentId, groupType, settingAlertLogAndLoading} = props

  return (
    <div className="animate-fadeIn">
      <NavBarComponent auth={auth} name={name} studentId={studentId}/>
      <div className='h-[56rem] bg-gradient-to-t from-white to-transparent mix-blend-soft-light'>
        <TaskAreaComponent auth={auth} studentId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
      </div>
    </div>
  )

}

export default Home