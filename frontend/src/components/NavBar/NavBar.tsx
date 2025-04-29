import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
// style
import {Collapse, IconButton, Navbar, Typography} from "@material-tailwind/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";

interface NavBarProps {
  title: string
  buttonList: Array<{ name: string, onClick: () => void }>
}

interface NavListProps {
  buttonList: Array<{ name: string, onClick: () => void }>
}

function NavList(props: NavListProps) {
  const {buttonList} = props

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {buttonList.map(({name, onClick}, index) => (
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-medium cursor-pointer hover:bg-gray-100"
          placeholder={undefined}
          onClick={onClick}
          key={index}
        >
          <a className="flex items-center hover:text-blue-500 transition-colors">
            {name}
          </a>
        </Typography>
      ))}
    </ul>
  );
}

const NavBarComponent = (props: NavBarProps) => {
  const {title, buttonList} = props
  const [openNav, setOpenNav] = useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  return (
    <Navbar className="pointer-events-auto mx-auto max-w-screen-xl px-6 py-3" placeholder={undefined}>
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          variant="h6"
          className="mr-4 select-none py-1.5"
          placeholder={undefined}
        >
          {title}
        </Typography>
        <div className="hidden lg:block">
          <NavList buttonList={buttonList}/>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
          placeholder={undefined}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2}/>
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2}/>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList buttonList={buttonList}/>
      </Collapse>
    </Navbar>
  )
}

export default NavBarComponent