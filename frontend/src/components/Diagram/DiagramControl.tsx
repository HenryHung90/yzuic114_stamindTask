import React, {useState, useEffect} from 'react';
import * as go from "gojs";
import {useNavigate} from "react-router-dom";
// style
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
// API
import {API_saveTaskDiagram} from '../../utils/API/API_Tasks'

// components

// interface
interface IDiagramControlProps {
  taskId: string | undefined
  diagramRef: React.RefObject<go.Diagram>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {ISettingAlertLogAndLoading} from "../../utils/interface/alertLog";

function NavList(props: IDiagramControlProps) {
  const {taskId, diagramRef, settingAlertLogAndLoading} = props
  const NavLocation = useNavigate()

  const buttonList = [
    {
      name: "儲存",
      onClick: () => {
        if (diagramRef.current && taskId) {
          settingAlertLogAndLoading.setLoadingOpen(true)
          const data = JSON.parse(diagramRef.current.model.toJson())
          API_saveTaskDiagram(data.nodeDataArray, data.linkDataArray, taskId).then(response => {
            settingAlertLogAndLoading.setAlertLog(response.message, response.message)
            settingAlertLogAndLoading.setLoadingOpen(false)
          })
        }
      }
    },
    {
      name: "離開",
      onClick: () => {
        NavLocation('/admin')
      }
    },
  ]

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

const DiagramControlComponent = (props: IDiagramControlProps) => {
  const {taskId, diagramRef, settingAlertLogAndLoading} = props
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
    <div
      className="overflow-hidden flex pointer-events-none items-end justify-center fixed w-screen h-screen p-6 z-[999]">
      <Navbar className="pointer-events-auto mx-auto max-w-screen-xl px-6 py-3" placeholder={undefined}>
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            variant="h6"
            className="mr-4 select-none py-1.5"
            placeholder={undefined}
          >
            教師編輯模式
          </Typography>
          <div className="hidden lg:block">
            <NavList taskId={taskId} diagramRef={diagramRef} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
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
          <NavList taskId={taskId} diagramRef={diagramRef} settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default DiagramControlComponent