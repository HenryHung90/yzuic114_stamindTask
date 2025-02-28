import {ISettingAlertLogAndLoading} from "./alertLog";

interface ITaskContentProps {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
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

export type {ITaskContentProps, ITaskExperienceProps, ITaskTargetProps, ITaskSubTarget, ITaskSubTargetProps}