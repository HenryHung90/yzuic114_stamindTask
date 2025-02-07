// style

// API

// components

// interface
interface IHomeProps {
  auth: false | 'STUDENT' | 'TEACHER';
  name: string;
  studentId: string;
}

const Home = (props: IHomeProps) => {
  const {auth, name, studentId} = props
  return (
    <div>Home page{auth}, {name}, {studentId}</div>
  )
}

export default Home