import React from "react";
// style
import {Button, Typography} from "@material-tailwind/react";

// API
import {
  handleDownloadAllCodeByTaskId,
  handleDownloadAllFeedbackByTaskId,
  handleDownloadChartsScreenShot
} from "../../../../../../utils/functions/admin/home/components/taskInfo";

// components
import MenuComponent, {IMenuItems} from "../../../../../../components/menu/Menu";

// interface
import {IDownloadBarProps} from "../../../../../../utils/interface/adminManage";


const DownloadBarComponent = (props: IDownloadBarProps) => {
  const {taskId, loading, setPageContent, chartsRef} = props;

  const TASK_DATA_MANAGEMENT_MENU_ITEMS = (): Array<IMenuItems> => [
    {
      name: '所有學生程式',
      handleClick: () => handleDownloadAllCodeByTaskId(loading, taskId || '')
    },
    {
      name: '所有學生回饋',
      handleClick: () => handleDownloadAllFeedbackByTaskId(loading, taskId || '')
    },
    {
      name: '數據截圖',
      handleClick: () => handleDownloadChartsScreenShot(loading, chartsRef)
    }
  ]

  const STUDENT_TASK_CONTENT_MENU_ITEMS = (): Array<IMenuItems> => [
    {
      name: '主頁面',
      handleClick: () => setPageContent('main')
    },
    {
      name: '個別學生程式狀態',
      handleClick: () => setPageContent('codeStatus')
    }
  ]

  return (
    <div>
      <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>課程數據</Typography>
      <div className='flex gap-x-2'>
        <MenuComponent menuHandler={"課程資料"} menuItems={STUDENT_TASK_CONTENT_MENU_ITEMS()}/>
        <MenuComponent menuHandler={"課程數據下載"} menuItems={TASK_DATA_MANAGEMENT_MENU_ITEMS()}/>
      </div>
    </div>
  )
}

export default DownloadBarComponent