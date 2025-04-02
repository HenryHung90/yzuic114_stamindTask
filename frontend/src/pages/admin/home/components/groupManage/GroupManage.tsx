import {useState} from "react";
// style

// API

// components
import ControlBarComponent from "./components/ControlBar"
import StudentGroupListComponent from "./components/StudentGroupList";

// interface
import {IGroupManageProps} from "../../../../../utils/interface/adminManage";

const GroupManageComponent = (props: IGroupManageProps) => {
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
      <StudentGroupListComponent className={className} classList={classList} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    </div>
  )
}

export default GroupManageComponent