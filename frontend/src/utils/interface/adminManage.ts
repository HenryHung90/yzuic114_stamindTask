import {Res_classNamesInfo} from "../API/API_Interface";
import {ISettingAlertLogAndLoading} from "./alertLog";
import React from "react";

interface IAdminMangeProps {
  classList: Array<Res_classNamesInfo>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}


interface IStudentManageProps extends IAdminMangeProps {
}

interface ITaskManageProps extends IAdminMangeProps {
}

interface IGroupManageProps extends IAdminMangeProps {
  className?: string
}

interface IGroupData {
  [key: string]: {
    class_name: string,
    group_type: string,
    student_list: Array<{ student_id: string, name: string }>
  }
}

interface IControlBarProps extends IAdminMangeProps {
  className: string
  setClassName: React.Dispatch<React.SetStateAction<string>>
}

interface IStudentManageControlBarProps extends IControlBarProps {
  searchStudentId: string
  setSearchStudentId: React.Dispatch<React.SetStateAction<string>>
}

export type {
  IStudentManageProps,
  ITaskManageProps,
  IGroupManageProps,
  IGroupData,
  IControlBarProps,
  IStudentManageControlBarProps,
}