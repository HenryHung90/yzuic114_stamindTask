import {useRoutes} from "react-router-dom";
import {useState, useEffect} from "react";
// style

// API
import {API_getUserInfo} from "./utils/API/API_LoginSystem";
// components
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import AlertLog from "./pages/alertLogAndLoadingPage/AlertLog";
import Loading from "./pages/alertLogAndLoadingPage/Loading";
import {CSRF_cookies, ResponseData} from "./utils/API/API_Interface";
// interface


export default function App() {
  const [auth, setAuth] = useState<false | 'STUDENT' | 'TEACHER'>(false)
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
      alert(err.message)
    })
  }, []);


  const unauth_routes = [
    {
      path: '*',
      element: <Login settingAlertLogAndLoading={settingAlertLogAndLoading} setAuth={setAuth} setName={setName} setStudentId={setStudentId}/>
    },
  ]

  const auth_routes = [
    {
      path: '/',
      element: <Home auth={auth} name={name} studentId={studentId}/>
    },
    {
      path: '/home',
      element: <Home auth={auth} name={name} studentId={studentId}/>
    }
  ]

  return (
    <>
      <Loading loadingOpen={loadingOpen}/>
      <AlertLog AlertOpen={alertOpen} AlertTitle={alertTitle} AlertMsg={alertMsg}
                AlertLogClose={() => settingAlertLogAndLoading.handleAlertClose()}/>
      {auth == false ? useRoutes(unauth_routes) : useRoutes(auth_routes)}
    </>
  )
}
