import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
// style
import {Card, Typography} from "@material-tailwind/react";

// API
import {API_getAllTasksInfo, API_getTasksByClassName} from "../../../../../../utils/API/API_Tasks";

// components
import MenuComponent, {IMenuItems} from "../../../../../../components/menu/Menu";

// interface
import {ISettingAlertLogAndLoading} from "../../../../../../utils/interface/alertLog"
import {Res_tasksInfo} from "../../../../../../utils/API/API_Interface";
import {
  handleChangeTaskName,
  handleSwitchTaskOpen
} from "../../../../../../utils/functions/admin/home/components/taskList";

interface ITaskListProps {
  className: string | undefined
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const TABLE_HEAD = ["是否啟用", "年級", "名稱", ""];


const TaskListComponent = (props: ITaskListProps) => {
  const {className, settingAlertLogAndLoading} = props
  const NavLocation = useNavigate()

  const [taskList, setTaskList] = useState<Array<Res_tasksInfo>>()

  const fetchTaskListAsync = () => {
    settingAlertLogAndLoading.setLoadingOpen(true)
    if (className == '' || className == 'ALL') {
      API_getAllTasksInfo().then(response => {
        setTaskList(response.data.tasks_info)
      })
    } else {
      API_getTasksByClassName(className || '').then(response => {
        setTaskList(response.data.tasks_info)
      })
    }
    settingAlertLogAndLoading.setLoadingOpen(false)
  }

  useEffect(() => {
    if (className !== 'loading') fetchTaskListAsync()
  }, [className])

  const MENU_ITEMS = (taskId: string): Array<IMenuItems> => [
    {
      name: "啟用/停用課程",
      handleClick: () => {
        handleSwitchTaskOpen({taskId, loading: settingAlertLogAndLoading, fetchTaskListAsync})
      }
    },
    {
      name: "變更課程名稱",
      handleClick: () => {
        handleChangeTaskName({taskId, loading: settingAlertLogAndLoading, fetchTaskListAsync})
      }
    },
    {
      name: "課程內容",
      handleClick: () => {
        NavLocation(`/admin/task/${taskId}`)
      }
    },
    {
      name: "課程數據",
      handleClick: () => {
        NavLocation(`/admin/taskInfo/${taskId}`)
      }
    },
    {
      name: "graphRAG 管理",
      handleClick: () => {
        NavLocation(`/admin/graphragInfo/${taskId}`)
      }
    }
  ]

  return (
    <Card className="h-[70vh] w-full overflow-scroll" placeholder={undefined}>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th key={head} className="text-center border-b border-blue-gray-100 bg-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
                placeholder={undefined}
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {taskList && taskList.map(({
                                     id,
                                     is_open,
                                     class_name,
                                     name,
                                   }, index) => (
          <tr key={index} className="text-center even:bg-blue-gray-50/50">
            <td className="p-2">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {is_open ? '🟢' : '🔴'}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {class_name}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {name}
              </Typography>
            </td>
            <td className="p-4 text-left">
              <MenuComponent menuHandler={"課程管理"} menuItems={MENU_ITEMS(id.toString())}/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Card>
  )
}

export default TaskListComponent
