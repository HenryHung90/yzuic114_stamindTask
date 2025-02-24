import {useState} from "react";
// style

// API

// components

// interface
interface ITaskManageProps {
  classList: Array<Res_classNamesInfo>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {Res_classNamesInfo} from "../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../utils/interface/alertLog";
import ControlBarComponent from "./components/ControlBar";
import TaskListComponent from "./components/TaskList";

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