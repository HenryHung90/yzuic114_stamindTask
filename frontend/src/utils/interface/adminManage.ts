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
  studentList?: Array<Res_studentsInfo>
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

interface ITaskListFuncProps {
  taskId: string
  loading: ISettingAlertLogAndLoading
  fetchTaskListAsync: () => void
}

// TaskInfo
interface ITaskInfoProps {
  loading: ISettingAlertLogAndLoading,
}

interface IDownloadBarProps extends ITaskInfoProps {
  taskId: string | undefined
  setPageContent: React.Dispatch<React.SetStateAction<'main' | 'codeStatus'>>
  chartsRef: React.RefObject<HTMLDivElement>
}

interface IDataVisualizationProps extends ITaskInfoProps {
  taskId: string | undefined
  chartsRef: React.RefObject<HTMLDivElement>
}

interface ISubTargetCompleted {
  completed: Array<number>
  notCompleted: Array<number>
  unselected: Array<number>
}

interface ICompleteStatus {
  '實驗組-完成': number
  '實驗組-未完成': number
  '操作組-完成': number
  '操作組-未完成': number
}

interface ISelfScoringData {
  min: number
  q1: number
  median: number
  q3: number
  max: number
}

interface IChatAIHeatMapData {
  day_list: Array<string>
  ask_times_list: Array<number>
  student_ask_list: Array<{ x: string, y: string, v: number }>
  student_list: Array<string>
}

interface IBoxPlotData {
  min: Array<number>,
  q1: Array<number>,
  median: Array<number>,
  means: Array<number>,
  q3: Array<number>,
  max: Array<number>
}

interface IStageDurationData {
  EXPERIMENTAL: IBoxPlotData,
  CONTROL: IBoxPlotData
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
  ITaskListFuncProps,
  ITaskInfoProps,
  IDownloadBarProps,
  IDataVisualizationProps,
  ISubTargetCompleted,
  ISelfScoringData,
  ICompleteStatus,
  IChatAIHeatMapData,
  IStageDurationData,
  IGroupManageProps,
  IGroupData,
}