import {useRoutes} from "react-router-dom";
import React, {useState, useEffect} from "react";
// style

// API
import {API_getUserInfo} from "./utils/API/API_LoginSystem";
import {handleTranslateAction, IStudentRecords} from "./utils/listener/action";

// components
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import AlertLog from "./components/alertLogAndLoadingPage/AlertLog";
import Loading from "./components/alertLogAndLoadingPage/Loading";
import Task from "./pages/task/Task";

import AdminHome from "./pages/admin/home/AdminHome"
import AdminTask from "./pages/admin/task/Task"
// interface
import {CSRF_cookies, ResponseData} from "./utils/API/API_Interface";
import {API_saveStudentRecords} from "./utils/API/API_StudentRecords";

export default function App() {
  const [auth, setAuth] = useState<false | 'STUDENT' | 'TEACHER'>(false)
  const [routes, setRoutes] = useState<Array<{ path: string; element: JSX.Element }>>([])
  const [name, setName] = useState<string>("")
  const [studentId, setStudentId] = useState<string>("")


  // Alert & Loading Setting
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [alertTitle, setAlertTitle] = useState<string>("")
  const [alertMsg, setAlertMsg] = useState<string>("")
  const [loadingOpen, setLoadingOpen] = useState<boolean>(false)

  const [tempStudentRecords, setTempStudentRecords] = useState<Array<IStudentRecords>>([])

  const settingAlertLogAndLoading = {
    setAlertLog: (title: string, msg: string) => {
      setAlertOpen(true)
      setAlertTitle(title)
      setAlertMsg(msg)
    },
    handleAlertClose: () => setAlertOpen(false),
    setLoadingOpen: (open: boolean) => setLoadingOpen(open)
  }

  useEffect(() => {
    API_getUserInfo().then((response: CSRF_cookies) => {
      if (response.isAuthenticated) {
        setAuth(response.isAuthenticated)
        setName(response.name)
        setStudentId(response.student_id)
      }
    }).catch((err: ResponseData) => {
      settingAlertLogAndLoading.setAlertLog("Server Error", err.message);
    })
  }, []);

  useEffect(() => {
    switch (auth) {
      case "STUDENT":
        setRoutes(auth_routes)
        break
      case "TEACHER":
        setRoutes([...auth_routes, ...teacher_routes])
        break
      default:
        setRoutes(unauth_routes)
    }
  }, [auth]);

  // 點擊事件偵測
  const handleClickEventToListenStudentHabit = (e: React.MouseEvent<HTMLDivElement>) => {
    // 不是學生或還沒有 studentId 時不做紀錄
    if (auth !== 'STUDENT' || !studentId) return

    const target = e.target as HTMLDivElement
    const dataset = target.dataset
    // 沒有打標記的都要跳掉
    if (!Object.values(dataset).length) return

    const recordData = handleTranslateAction(dataset, studentId)
    if (recordData) setTempStudentRecords(prevState => [...prevState, recordData])
  }
  // 每 5 秒檢測是否有紀錄未上傳，有就上傳
  // useEffect(() => {
  //   setInterval(() => {
  //     if(tempStudentRecords.length > 0){
  //
  //     }
  //   }, 5000)
  // }, []);
  useEffect(() => {
    console.log(tempStudentRecords)
    if (tempStudentRecords.length > 50) {
      API_saveStudentRecords(tempStudentRecords).then(response => {
        console.log(response.data)
        setTempStudentRecords([])
      })
    }
  }, [tempStudentRecords]);

  const unauth_routes = [
    {
      path: '*',
      element: <Login settingAlertLogAndLoading={settingAlertLogAndLoading} setAuth={setAuth} setName={setName}
                      setStudentId={setStudentId}/>
    },
  ]

  const auth_routes = [
    {
      path: '/',
      element: <Home auth={auth} name={name} studentId={studentId}
                     settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    },
    {
      path: '/home',
      element: <Home auth={auth} name={name} studentId={studentId}
                     settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    },
    {
      path: '/task/:taskId',
      element: <Task name={name} studentId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}
                     setTempStudentRecords={setTempStudentRecords}/>
    }
  ]

  const teacher_routes = [
    {
      path: '/admin',
      element: <AdminHome name={name} adminId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    },
    {
      path: '/admin/:page',
      element: <AdminHome name={name} adminId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    },
    {
      path: '/admin/task/:taskId',
      element: <AdminTask settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    }
  ]

  return (
    <div onClick={handleClickEventToListenStudentHabit}>
      <Loading loadingOpen={loadingOpen}/>
      <AlertLog AlertOpen={alertOpen} AlertTitle={alertTitle} AlertMsg={alertMsg}
                AlertLogClose={() => settingAlertLogAndLoading.handleAlertClose()}/>
      {useRoutes(routes)}
    </div>
  )
}
