import {useNavigate, useRoutes} from "react-router-dom";
import React, {useState, useEffect} from "react";
// style

// API
import {API_getUserInfo} from "./utils/API/API_LoginSystem";
// components
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import AlertLog from "./components/alertLogAndLoadingPage/AlertLog";
import Loading from "./components/alertLogAndLoadingPage/Loading";
import Task from "./pages/task/Task";

import AdminHome from "./pages/admin/home/AdminHome";
import AdminTask from "./pages/admin/task/Task"
// interface
import {CSRF_cookies, ResponseData} from "./utils/API/API_Interface";


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
      element: <Task name={name} studentId={studentId} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
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
    <>
      <Loading loadingOpen={loadingOpen}/>
      <AlertLog AlertOpen={alertOpen} AlertTitle={alertTitle} AlertMsg={alertMsg}
                AlertLogClose={() => settingAlertLogAndLoading.handleAlertClose()}/>
      {useRoutes(routes)}
    </>
  )
}
