import {useState, useEffect, useMemo} from "react";
// style
import {
  Card,
  Typography,
} from "@material-tailwind/react";
// API
import {
  handleSwitchActive,
  handleSwitchGroup,
  handleChangeClassName,
  handleChangeName,
  handleChangePassword,
  handleChangeStudentId,
  handleDonwloadChatHistories,
  handleDonwloadFeedback,
  handleDonwloadStudentRecord
} from "../../../../../../utils/functions/admin/home/components/studentList";
// components
import MenuComponent from "../../../../../../components/menu/Menu";
import MultipleMenuComponent from "../../../../../../components/menu/MultipleMenu";

// interface
import {IMenuItems} from "../../../../../../components/menu/Menu";
import {API_getAllStudents, API_getStudentsByClassName} from "../../../../../../utils/API/API_Students";
import {Res_classNamesInfo, Res_studentsInfo} from "../../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../../utils/interface/alertLog";

interface IStudentListProps {
  className: string | undefined
  classList: Array<Res_classNamesInfo>
  searchStudentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const TABLE_HEAD = ["是否啟用", "年級", "組別", "學號", "姓名", ""];

const StudentListComponent = (props: IStudentListProps) => {
  const {className, classList, searchStudentId, settingAlertLogAndLoading} = props
  const [studentList, setStudentList] = useState<Array<Res_studentsInfo>>()
  const [filteredStudentList, setFilteredStudentList] = useState<Array<Res_studentsInfo>>()

  const stableStudentList = useMemo(() => studentList || [], [studentList])

  const fetchStudentListAsync = async () => {
    settingAlertLogAndLoading.setLoadingOpen(true)
    if (className == '' || className == 'ALL') {
      await API_getAllStudents().then(response => {
        setStudentList(response.data.students_data)
      })
    } else {
      await API_getStudentsByClassName(className || '').then(response => {
        setStudentList(response.data.students_data)
      })
    }
    settingAlertLogAndLoading.setLoadingOpen(false)
  }

  useEffect(() => {
    if (className !== 'loading') fetchStudentListAsync()
  }, [className]);

  useEffect(() => {
    if (stableStudentList && searchStudentId !== '') {
      const filtered = stableStudentList.filter((student) =>
        student.student_id.includes(searchStudentId)
      );
      // 僅當結果不同時更新狀態
      if (JSON.stringify(filtered) !== JSON.stringify(filteredStudentList)) {
        setFilteredStudentList(filtered);
      }
    } else {
      // 如果沒有搜尋條件，顯示完整列表
      if (JSON.stringify(stableStudentList) !== JSON.stringify(filteredStudentList)) {
        setFilteredStudentList(stableStudentList);
      }
    }
  }, [searchStudentId, stableStudentList])


  const MENU_ITEMS = (studentId: string): Array<IMenuItems> => [
    {
      name: "啟用/停用帳號",
      handleClick: () => handleSwitchActive(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
    },
    {
      name: "變更實驗組/對照組",
      handleClick: () => handleSwitchGroup(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
    },
    {
      subMenu: <MultipleMenuComponent menuTitle={"學生資料變更"} menuItems={[
        {
          name: "變更年級",
          handleClick: () => handleChangeClassName(studentId, classList, settingAlertLogAndLoading, fetchStudentListAsync)
        },
        {
          name: "變更名稱",
          handleClick: () => handleChangeName(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        },
        {
          name: "變更學號",
          handleClick: () => handleChangeStudentId(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        },
        {
          name: "變更密碼",
          handleClick: () => handleChangePassword(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        }
      ]}/>
    },
    {
      subMenu: <MultipleMenuComponent menuTitle={"學生資料下載"} menuItems={[
        {
          name: "下載聊天記錄",
          handleClick: () => handleDonwloadChatHistories(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        },
        {
          name: "下載回饋內容",
          handleClick: () => handleDonwloadFeedback(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        },
        {
          name: "下載操作行為",
          handleClick: () => handleDonwloadStudentRecord(studentId, settingAlertLogAndLoading, fetchStudentListAsync)
        }
      ]}/>
    }
  ]

  return (
    <Card className="h-[60vh] w-full overflow-scroll" placeholder={undefined}>
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
        {filteredStudentList && filteredStudentList.map(({
                                                           is_active,
                                                           class_name,
                                                           group_type,
                                                           student_id,
                                                           name
                                                         }, index) => (
          <tr key={index} className="text-center even:bg-blue-gray-50/50">
            <td className="p-2">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {is_active ? '🟢' : '🔴'}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {class_name}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {group_type === 'EXPERIMENTAL' && '🧪 實驗組'}
                {group_type === 'CONTROL' && '🔒 控制組'}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {student_id}
              </Typography>
            </td>
            <td className="p-4">
              <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                {name}
              </Typography>
            </td>
            <td className="p-4 text-left">
              <MenuComponent menuHandler={"學生設定"} menuItems={MENU_ITEMS(student_id)}/>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Card>
  )
}

export default StudentListComponent