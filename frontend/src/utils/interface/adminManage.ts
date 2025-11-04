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

// graphRag Info
export interface IGraphragInfoProps {
  loading: ISettingAlertLogAndLoading
}

export interface IGraphragStatus {
  community_count: number;
  entity_count: number;
  relationship_count: number;
  source_count: number;
  summary_count: number;
}

// 社區 (Communities) 介面
export interface ICommunity {
  id: string;
  human_readable_id: number;
  community: number;
  level: number;
  parent: number;
  children: number[];
  title: string;
  entity_ids: string[];
  relationship_ids: string[];
  text_unit_ids: string[];
  size: number;
  entity_count?: number;
  relationship_count?: number;
  text_unit_count?: number;
  has_children?: boolean;
  is_root?: boolean;
  period: null | string;
}

// 實體 (Entities) 介面
export interface IEntity {
  id: string;
  human_readable_id: number;
  title: string;
  type: string;
  description: string;
  text_unit_ids: string[];
  frequency: number;
  degree: number;
  position?: any | null;
  x?: number | null;
  y?: number | null;
}

// 關係 (Relationships) 介面
export interface IRelationship {
  id: string;
  human_readable_id: number;
  source: string;
  target: string;
  description: string;
  weight: number;
  combined_degree: number;
  text_unit_ids: string[];
  strength?: {
    weight: number;
    combined_degree: number;
    strength_score: number;
  };
}

// 來源 (Sources) 介面
export interface ISource {
  id: string;
  human_readable_id: number;
  text: string;
  n_tokens: number;
  document_ids: string[];
  entity_ids: string[];
  relationship_ids: string[];
  covariate_ids: string[];
  document_count?: number;
  entity_count?: number;
  relationship_count?: number;
  covariate_count?: number;
}

// 摘要 (Summaries) 介面
export interface ISummary {
  id: string;
  human_readable_id: number;
  community: number;
  level: number;
  parent: number | null;
  children: number[];
  title: string;
  summary: string;
  full_content: string;
  rank: number;
  rating_explanation: string;
  findings: any[]; // JSON 欄位，根據實際內容可以進一步定義
  full_content_json: any; // JSON 欄位，根據實際內容可以進一步定義
  size: number | null;
  period?: null | string;
}

export interface IGraphragData {
  data_count: IGraphragStatus;
  communities: ICommunity[];
  entities: IEntity[];
  relationships: IRelationship[];
  sources: ISource[];
  summaries: ISummary[];
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
