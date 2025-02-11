import {useEffect, useState} from "react";
// style

// API

// components
import StudentListComponent from "./components/StudentList";
import ControlBarComponent from "./components/ControlBar";

// interface
import {Res_classNamesInfo} from "../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../utils/interface/alertLog";

interface IStudentManageProps {
  classList: Array<Res_classNamesInfo>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const StudentManageComponent = (props: IStudentManageProps) => {
  const {classList, settingAlertLogAndLoading} = props
  const [className, setClassName] = useState<string>("ALL")
  const [searchStudentId, setSearchStudentId] = useState<string>("")

  return (
    <div>
      <ControlBarComponent
        classList={classList}
        className={className}
        setClassName={setClassName}
        searchStudentId={searchStudentId}
        setSearchStudentId={setSearchStudentId}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <StudentListComponent
        className={className}
        classList={classList}
        searchStudentId={searchStudentId}
        settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    </div>
  )
}

export default StudentManageComponent