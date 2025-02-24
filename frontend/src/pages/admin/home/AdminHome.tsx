import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
// style

// API
import {API_getAllClassNames} from "../../../utils/API/API_ClassName";

// components
import StudentManageComponent from "./components/studentManage/StudentMange";
import NavBarComponent from './components/NavBar'

// interface
import {Res_classNamesInfo} from "../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../utils/interface/alertLog";
import TaskManageComponent from "./components/taskManage/TaskManage";

interface IAdminHomeProps {
  name: string;
  adminId: string;
  settingAlertLogAndLoading: ISettingAlertLogAndLoading;
}

const AdminHome = (props: IAdminHomeProps) => {
  const {name, adminId, settingAlertLogAndLoading} = props
  const {page} = useParams<{ page: 'studentMange' | 'taskManage' | 'classAndGroupManage' }>();

  const [classList, setClassList] = useState<Array<Res_classNamesInfo>>([{
    message: 'loading',
    data: '',
    status: 100,
    id: 0,
    name: 'loading',
    created_at: '',
    updated_at: ''
  }])

  useEffect(() => {
    const fetchDataAsync = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      await API_getAllClassNames().then(response => {
        setClassList(response.data.class_info)
        settingAlertLogAndLoading.setLoadingOpen(false)
      })
    }

    fetchDataAsync()
  }, [])

  return (
    <div className="animate-fadeIn">
      <NavBarComponent name={name} adminId={adminId}/>
      <div
        className='p-10 h-[56rem] bg-gradient-to-tl from-transparent to-stamindTask-decoration-warn-2 mix-blend-soft-light backdrop-blur-sm'>
        {page === 'studentMange' && <StudentManageComponent classList={classList} settingAlertLogAndLoading={settingAlertLogAndLoading}/>}
        {page === 'taskManage' && <TaskManageComponent classList={classList} settingAlertLogAndLoading={settingAlertLogAndLoading}/>}
      </div>
    </div>
  )
}


export default AdminHome