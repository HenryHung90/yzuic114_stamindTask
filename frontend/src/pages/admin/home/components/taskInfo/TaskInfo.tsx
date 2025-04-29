import React from "react";
import {useParams} from "react-router-dom"
// style
import {Button, Typography} from "@material-tailwind/react";

// API

// components
import {handleDownloadAllCodeByTaskId} from "../../../../../utils/functions/admin/home/components/taskInfo";

// interface
import {ITaskInfoProps} from "../../../../../utils/interface/adminManage";

const TaskInfo = (props: ITaskInfoProps) => {
  const {loading} = props
  const {taskId} = useParams()

  return (
    <div className='w-[100vw] h-[100vh] p-10 animate-messageSlideIn'>
      <Button variant='gradient' color='red' className='mb-4' placeholder={undefined}
              onClick={() => window.history.back()}>返回</Button>
      <div className='h-[90%] p-10 bg-stamindTask-white-100 rounded-xl shadow-lg shadow-black/50'>
        <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>課程數據</Typography>
        <div>
          <Button variant="gradient" placeholder={undefined}
                  onClick={() => handleDownloadAllCodeByTaskId(loading, taskId || '')}>下載所有學生程式</Button>
        </div>
      </div>
    </div>
  )
}

export default TaskInfo