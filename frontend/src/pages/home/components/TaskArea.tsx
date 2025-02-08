// style

// API

// components
import TaskCardComponent from "./TaskCard";
// interface
import {useEffect, useState} from "react";
import {API_getTasksInfo} from "../../../utils/API/API_Home";
import {Res_tasksInfo} from "../../../utils/API/API_Interface";

interface ITaskAreaProps {
  studentId: string;
}

const TaskAreaComponent = (props: ITaskAreaProps) => {
  const {studentId} = props;

  const [tasks, setTasks] = useState<Array<Res_tasksInfo>>([]);

  useEffect(() => {
    API_getTasksInfo(studentId).then(response => {
      setTasks(response.data.tasks_info ?? []);
    })

  }, []);

  return (
    <div className='flex gap-5 m-10'>
      {tasks.map((task, i) => {
        return <TaskCardComponent key={i} id={task.id} name={task.name} created_at={task.created_at}
                                  updated_at={task.updated_at}/>;
      })
      }
    </div>
  )
}

export default TaskAreaComponent