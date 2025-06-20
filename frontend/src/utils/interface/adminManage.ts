import React from "react";
import {Res_classNamesInfo, Res_studentsInfo} from "../API/API_Interface";
import {ISettingAlertLogAndLoading} from "./alertLog";

export interface IAdminMangeProps {
  classList: Array<Res_classNamesInfo>
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

export interface IControlBarProps extends IAdminMangeProps {
  className: string
  setClassName: React.Dispatch<React.SetStateAction<string>>
}


// Student Manage -> Student List
export interface IStudentListFuncProps {
  studentId: string
  loading: ISettingAlertLogAndLoading
  fetchStudentListAsync: () => void
  classList?: Array<Res_classNamesInfo>
}

export interface IStudentManageProps extends IAdminMangeProps {
  studentList?: Array<Res_studentsInfo>
}


export interface IStudentManageControlBarProps extends IControlBarProps {
  searchStudentId: string
  studentList: Array<Res_studentsInfo>
  setSearchStudentId: React.Dispatch<React.SetStateAction<string>>
}

export interface IStudentListProps extends IStudentManageProps {
  className: string | undefined
  classList: Array<Res_classNamesInfo>
  searchStudentId: string
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
  fetchStudentListAsync: () => void
}

// TaskManagement
export interface ITaskManageProps extends IAdminMangeProps {
}

export interface ITaskListFuncProps {
  taskId: string
  loading: ISettingAlertLogAndLoading
  fetchTaskListAsync: () => void
}

// TaskInfo
export interface ITaskInfoProps {
  loading: ISettingAlertLogAndLoading,
}

export interface IDownloadBarProps extends ITaskInfoProps {
  taskId: string | undefined
  setPageContent: React.Dispatch<React.SetStateAction<'main' | 'codeStatus'>>
  chartsRef: React.RefObject<HTMLDivElement>
}

export interface IDataVisualizationProps extends ITaskInfoProps {
  taskId?: string | undefined
  classList?: Array<number>
  chartsRef: React.RefObject<HTMLDivElement>
}

export interface ISubTargetCompleted {
  completed: Array<number>
  notCompleted: Array<number>
  unselected: Array<number>
}

export interface ICompleteStatus {
  '實驗組-完成': number
  '實驗組-未完成': number
  '操作組-完成': number
  '操作組-未完成': number
}

export interface ISelfScoringData {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

export interface IChatAIHeatMapData {
  day_list: Array<string>
  ask_times_list: Array<number>
  student_ask_list: Array<{ x: string, y: string, v: number }>
  student_list: Array<string>
}

export interface IBoxPlotData {
  min: Array<number>,
  q1: Array<number>,
  median: Array<number>,
  means: Array<number>,
  q3: Array<number>,
  max: Array<number>
}


export interface IStageDurationData {
  EXPERIMENTAL: IBoxPlotData
  CONTROL: IBoxPlotData
}

export interface IStageClickData {
  EXPERIMENTAL: Array<number>
  CONTROL: Array<number>
}

// GroupManagement
export interface IGroupManageProps extends IAdminMangeProps {
  className?: string
}

export interface IGroupData {
  [key: string]: {
    class_name: string,
    group_type: string,
    student_list: Array<{ student_id: string, name: string }>
  }
}

// dataManage
export interface IDataMangeProps {
  loading: ISettingAlertLogAndLoading,
}