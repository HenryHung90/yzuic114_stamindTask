import {Res_classNamesInfo, Res_studentsInfo} from "../API/API_Interface";
import {ISettingAlertLogAndLoading} from "./alertLog";
import React from "react";

interface IAdminMangeProps {
  classList: Array<Res_classNamesInfo>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

interface IControlBarProps extends IAdminMangeProps {
  className: string
  setClassName: React.Dispatch<React.SetStateAction<string>>
}


// Student Manage -> Student List
interface IStudentListFuncProps {
  studentId: string
  loading: ISettingAlertLogAndLoading
  fetchStudentListAsync: () => void
  classList?: Array<Res_classNamesInfo>
}

interface IStudentManageProps extends IAdminMangeProps {
  studentList: Array<Res_studentsInfo>
}


interface IStudentManageControlBarProps extends IControlBarProps {
  searchStudentId: string
  studentList: Array<Res_studentsInfo>
  setSearchStudentId: React.Dispatch<React.SetStateAction<string>>
}

interface IStudentListProps extends IStudentManageProps {
  className: string | undefined
  classList: Array<Res_classNamesInfo>
  searchStudentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
  fetchStudentListAsync: () => void
}

// TaskManagement
interface ITaskManageProps extends IAdminMangeProps {
}

// GroupManagement
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


export type {
  IStudentManageProps,
  IStudentListFuncProps,
  IControlBarProps,
  IStudentListProps,
  IStudentManageControlBarProps,
  ITaskManageProps,
  IGroupManageProps,
  IGroupData,
}