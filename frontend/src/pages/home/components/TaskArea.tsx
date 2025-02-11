import {useEffect, useState} from "react";
// style

// API
import {API_getTasksInfo, API_getAllTasksInfo} from "../../../utils/API/API_Home";

// components
import TaskCardComponent from "./TaskCard";
// interface
import {Res_tasksInfo} from "../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../utils/interface/alertLog";

interface ITaskAreaProps {
  auth: false | 'STUDENT' | 'TEACHER'
  studentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const TaskAreaComponent = (props: ITaskAreaProps) => {
  const {auth, studentId, settingAlertLogAndLoading} = props;

  const [tasks, setTasks] = useState<Array<Res_tasksInfo>>([]);

  useEffect(() => {
    settingAlertLogAndLoading.setLoadingOpen(true)
    if (auth === 'STUDENT') {
      API_getTasksInfo(studentId).then(response => {
        setTasks(response.data.tasks_info ?? [])
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    } else {
      API_getAllTasksInfo().then(response => {
        setTasks(response.data.tasks_info ?? [])
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }

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