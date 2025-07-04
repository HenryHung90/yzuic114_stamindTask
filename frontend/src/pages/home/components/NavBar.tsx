import React, {useEffect, useState} from "react";
// style
import {Button, IconButton, Collapse, Navbar, Typography} from "@material-tailwind/react";
// API
import {API_logout} from "../../../utils/API/API_LoginSystem";
import {useNavigate} from "react-router-dom";
import ImageComponent from "../../../components/Image/Image";
// components

// interface

interface INavBarProps {
  auth: false | 'STUDENT' | 'TEACHER'
  name: string
  studentId: string
}

const NavBarComponent = (props: INavBarProps) => {
  const {auth, name, studentId} = props
  const NavLocation = useNavigate()

  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  // 登出
  function logout() {
    API_logout().then(response => {
      window.location.href = `${import.meta.env.VITE_APP_BASENAME ?? '/'}`
    })
  }

  function switchTeacherSide() {
    NavLocation('/admin')
  }

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-ri lg:gap-6">
      <Typography className="flex justify-center items-center px-2 select-none text-sm" placeholder={undefined}>
        {name} {studentId}
      </Typography>
      <Button
        variant="text"
        color="blue-gray"
        placeholder={undefined}
        data-action='navigate'
        data-type='button'
        data-object='task'
        data-id='home_task'
      >
        任務
      </Button>
      <Button
        variant="text"
        color="blue-gray"
        placeholder={undefined}
        data-action='navigate'
        data-type='button'
        data-object='personData'
        data-id='home_personData'
      >
        個人數據
      </Button>
      {auth === 'TEACHER' &&
          <Button
              variant="text"
              color='deep-orange'
              placeholder={undefined}
              onClick={() => switchTeacherSide()}
          >
              教師頁面
          </Button>
      }
    </ul>
  );


  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4"
            placeholder={undefined}>
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          className="flex justify-center items-center mr-4 cursor-pointer py-1.5 font-bold"
          placeholder={undefined}
        >
          <ImageComponent
            src={`${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/img/logo.PNG`} alt='logo'
            width='24px' height='24px'/>
          Stamind Task
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              variant="outlined"
              size="sm"
              className="hidden lg:inline-block"
              placeholder={undefined}
              onClick={logout}
              data-action='click'
              data-type='button'
              data-object='logout'
              data-id='home_logout'
            >
              <span>登出</span>
            </Button>
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
            placeholder={undefined}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button
            fullWidth
            variant="text"
            size="sm"
            className=""
            onClick={logout}
            placeholder={undefined}
            data-action='click'
            data-type='button'
            data-object='logout'
            data-id='home_logout'
          >
            <span>登出</span>
          </Button>
        </div>
      </Collapse>
    </Navbar>
  )
}

export default NavBarComponent