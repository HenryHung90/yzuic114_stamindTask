import {useEffect, useState} from "react";
// style

// API

// components
import StudentListComponent from "./components/StudentList";
import ControlBarComponent from "./components/ControlBar";

// interface
import {IStudentManageProps} from "../../../../../utils/interface/adminManage";


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