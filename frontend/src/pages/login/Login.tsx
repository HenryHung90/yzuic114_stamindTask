import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import $ from 'jquery'
// style
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button
} from "@material-tailwind/react";
// API
import {API_login} from "../../utils/API/API_LoginSystem";
// components

// interface
import {ISettingAlertLogAndLoading} from "../../utils/interface/alertLog";
import {ResponseData} from "../../utils/API/API_Interface";

interface ILoginProps {
  settingAlertLogAndLoading: ISettingAlertLogAndLoading;
  setAuth: React.Dispatch<React.SetStateAction<false | 'STUDENT' | 'TEACHER'>>;
  setName: React.Dispatch<React.SetStateAction<string>>
  setStudentId: React.Dispatch<React.SetStateAction<string>>;
}

const Login = (props: ILoginProps) => {

  const {settingAlertLogAndLoading, setAuth, setName, setStudentId} = props;

  const [acc, setAcc] = useState<string>("")
  const [psw, setPsw] = useState<string>("")
  const NavLocation = useNavigate()

  useEffect(() => {
    $('#acc').on('keyup', (e: { preventDefault: () => void; key: string; }) => {
      e.preventDefault()
      if (e.key === "Enter") $('#login').click()
    })
    $('#psw').on('keyup', (e: { preventDefault: () => void; key: string; }) => {
      e.preventDefault()
      if (e.key === "Enter") $('#login').click()
    })
  }, []);


  //Login Function
  function login() {
    if (acc === "" || psw === "") {
      return settingAlertLogAndLoading.setAlertLog("錯誤", "帳號或密碼不得為空!")
    }
    settingAlertLogAndLoading.setLoadingOpen(true)
    API_login(acc, psw).then((response) => {
      if (response.status === 200) {
        setName(response.name)
        setAuth(response.user_type)
        setStudentId(response.student_id)
        settingAlertLogAndLoading.setLoadingOpen(false)

        response.user_type === 'TEACHER' ? NavLocation("/admin") : NavLocation("/home")
      } else {
        settingAlertLogAndLoading.setLoadingOpen(false)
        settingAlertLogAndLoading.setAlertLog('錯誤', response.message)
      }
    }).catch((err: ResponseData) => {
      alert(err.message)
    })
  }


  return (
    <div className='flex justify-center items-center w-[100vw] h-[100vh] animate-fadeIn'>
      <Card className='w-96' placeholder={undefined}>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-36 place-items-center"
          placeholder={undefined}>
          <img src={`/${import.meta.env.VITE_APP_FILE_ROUTE}/img/logo.PNG`} height='50px' width='70px'/>
          <p className='text-xl '>STAMIND TASK</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 animate-loginSlideIn delay-700" placeholder={undefined}>
          <Input label="StudentId" id='acc' size="lg" type="text" value={acc} onChange={e => {
            setAcc(e.target.value)
          }} crossOrigin={undefined}/>
          <Input label="Password" id='psw' size="lg" type="password" value={psw} onChange={e => {
            setPsw(e.target.value)
          }} crossOrigin={undefined}/>
          <Button variant="gradient" id='login' fullWidth className='mt-4 animate-loginSlideIn delay-1000'
                  onClick={login}
                  placeholder={undefined}
          >
            Log In
          </Button>
        </CardBody>
        <CardFooter className="text-center text-[0.6rem] text-stamindTask-black-850" placeholder={undefined}>
          <p>all right reserved</p>
          <p>Copyright© Henry.H</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login