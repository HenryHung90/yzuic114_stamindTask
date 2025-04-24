import {useEffect, useState} from "react";
// style

// API

// components
import StudentListComponent from "./components/StudentList";
import ControlBarComponent from "./components/ControlBar";

// interface
import {IStudentManageProps} from "../../../../../utils/interface/adminManage";
import {API_getAllStudents, API_getStudentsByClassName} from "../../../../../utils/API/API_Students";
import {Res_studentsInfo} from "../../../../../utils/API/API_Interface";


const StudentManageComponent = (props: IStudentManageProps) => {
  const {classList, settingAlertLogAndLoading} = props
  const [className, setClassName] = useState<string>("ALL")
  const [searchStudentId, setSearchStudentId] = useState<string>("")
  const [studentList, setStudentList] = useState<Array<Res_studentsInfo>>([])


  const fetchStudentListAsync = () => {
    settingAlertLogAndLoading.setLoadingOpen(true)
    if (className == '' || className == 'ALL') {
      API_getAllStudents().then(response => {
        setStudentList(response.data.students_data)
      })
    } else {
      API_getStudentsByClassName(className || '').then(response => {
        setStudentList(response.data.students_data)
      })
    }
    settingAlertLogAndLoading.setLoadingOpen(false)
  }

  useEffect(() => {
    if (className !== 'loading') fetchStudentListAsync()
  }, [className])

  return (
    <div>
      <ControlBarComponent
        studentList={studentList}
        classList={classList}
        className={className}
        setClassName={setClassName}
        searchStudentId={searchStudentId}
        setSearchStudentId={setSearchStudentId}
        settingAlertLogAndLoading={settingAlertLogAndLoading}
      />
      <StudentListComponent
        studentList={studentList}
        fetchStudentListAsync={fetchStudentListAsync}
        className={className}
        classList={classList}
        searchStudentId={searchStudentId}
        settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    </div>
  )
}

export default StudentManageComponent