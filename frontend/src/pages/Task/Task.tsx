import {useState} from "react";
import {useParams} from 'react-router-dom';
// style

// API

// components

// interface
interface ITaskProps {
  studentId: string;
}


const Task = (props: ITaskProps) => {
  const {studentId} = props;
  const {id} = useParams();
  const [taskId, setTaskId] = useState<string | undefined>(id);

  return (
    <div>
      Task Area
      <p>task id:{taskId}</p>
      <p>student id:{studentId}</p>
    </div>
  )
}

export default Task