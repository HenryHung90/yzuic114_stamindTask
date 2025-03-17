import {ISettingAlertLogAndLoading} from "./alertLog";
import React from "react";

interface ITaskProps {
  studentId?: string;
  name?: string;
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

interface ITaskContentProps extends ITaskProps {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
}

interface ITaskExperienceProps extends ITaskContentProps {
  iframeKey?: number
}

interface ITaskTargetProps extends ITaskContentProps {
  savingTrigger: number
}

interface ITaskSubTarget {
  title: string
  description: string
}

interface ITaskSubTargetProps extends ITaskSubTarget {
  index: number | undefined
  handleEditSubTargetTitle: (index: number, key: 'title' | 'description', value: string) => void
  handleDeleteSubTargetTitle: (index: number) => void
}

//Plan
interface ITaskPlanProps extends ITaskContentProps {
  savingTrigger: number
}

interface ITaskPlan {
  strategy: 'environment' | 'learning_strategy' | 'time_management' | 'finding_help' | 'self_assessment'
  description: string
  time?: string
}

interface ITaskPlanContentProps {
  plan: ITaskPlan
  handleChangePlanList: (field: 'strategy' | 'description' | 'time', value: string, subTargetIndex: number, planIndex: number) => void
  handleDeletePlanList: (subTargetIndex: number, planIndex: number) => void
  subTargetIndex: number
  planIndex: number
}

interface ITaskSubTargetLisProps {
  subTargetList: Array<ITaskSubTarget>
  selectSubList: Array<boolean>
  setSelectSubList: React.Dispatch<React.SetStateAction<Array<boolean>>>
}

//Process
interface ITaskProcessProps extends ITaskContentProps {
}

export type {
  ITaskProps,
  ITaskContentProps,
  ITaskExperienceProps,
  ITaskTargetProps,
  ITaskSubTarget,
  ITaskSubTargetProps,
  ITaskPlanProps,
  ITaskPlan,
  ITaskPlanContentProps,
  ITaskSubTargetLisProps,
  ITaskProcessProps
}