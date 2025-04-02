import {useState} from "react";
// style

// API

// components
import ControlBarComponent from "./components/ControlBar";
import TaskListComponent from "./components/TaskList";

// interface
import {ITaskManageProps} from "../../../../../utils/interface/adminManage";

const TaskManageComponent = (props: ITaskManageProps) => {
  const {classList, settingAlertLogAndLoading} = props
  const [className, setClassName] = useState<string>("ALL")

  return (
    <div>
      <ControlBarComponent
        classList={classList}
        className={className}
        setClassName={setClassName}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <TaskListComponent
        className={className}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
    </div>
  )
}

export default TaskManageComponent