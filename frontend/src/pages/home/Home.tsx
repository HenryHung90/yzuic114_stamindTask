// style

// API

// components
import NavBarComponent from "./components/NavBar"
import TaskAreaComponent from './components/TaskArea'

// interface
interface IHomeProps {
  auth: false | 'STUDENT' | 'TEACHER';
  name: string;
  studentId: string;
}

const Home = (props: IHomeProps) => {
  const {auth, name, studentId} = props

  return (
    <div className="animate-fadeIn">
      <NavBarComponent name={name} studentId={studentId}/>
      <div className='h-[56rem] bg-gradient-to-t from-white to-transparent mix-blend-soft-light'>
        <TaskAreaComponent studentId={studentId}/>
      </div>
    </div>
  )

}

export default Home