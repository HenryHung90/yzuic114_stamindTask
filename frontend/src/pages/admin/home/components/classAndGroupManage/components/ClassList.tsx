import {useEffect, useState} from "react";
// style
import {Card, Typography, Button} from "@material-tailwind/react";

// API
import {APIT_getAllClassAndGroups} from "../../../../../../utils/API/API_ClassName";

// components

// interface
interface IClassListProps {
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {Res_classWithStudentsInfo} from "../../../../../../utils/API/API_Interface";
import {ISettingAlertLogAndLoading} from "../../../../../../utils/interface/alertLog";
import ClassManagementComponent from "./ClassManagement";

const ClassListComponent = (props: IClassListProps) => {
  const {settingAlertLogAndLoading} = props
  const [classWithStudentList, setClassWithStudentList] = useState<Array<Res_classWithStudentsInfo>>()
  const [selectClass, setSelectClass] = useState<Res_classWithStudentsInfo>();
  const [managementOpen, setManagementOpen] = useState<boolean>(false)

  const TABLE_HEAD = ["ID", "班級", "組別數", "人數", ""]


  useEffect(() => {
    const fetchClassAndGroups = async () => {
      APIT_getAllClassAndGroups().then(response => {
        setClassWithStudentList(response.data.data_info)
      })
    }
    fetchClassAndGroups()
  }, []);

  const handleManageClass = (classIndex: number) => {
    if (classWithStudentList) setSelectClass(classWithStudentList[classIndex])
    setManagementOpen(true)
  }


  return (
    <>
      <ClassManagementComponent
        open={managementOpen}
        handleOpen={() => setManagementOpen(false)}
        classWithStudentList={selectClass}
      />
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
          {classWithStudentList && classWithStudentList.map(({
                                                               id,
                                                               class_name,
                                                               group_list,
                                                               student_list
                                                             }, index) => (
            <tr key={index} className="text-center even:bg-blue-gray-50/50">
              <td className="p-2">
                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                  {id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                  {class_name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                  {group_list.length}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                  {student_list.length}
                </Typography>
              </td>
              <td className="p-4 text-left">
                <Button placeholder={undefined}
                        onClick={() => handleManageClass(index)}>設定</Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </Card>
    </>
  )
}

export default ClassListComponent;