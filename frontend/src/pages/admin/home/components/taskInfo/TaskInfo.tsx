import React, {useRef, useState} from "react";
import {useParams} from "react-router-dom"
// style
import {Button} from "@material-tailwind/react";

// API

// components
import DownloadBarComponent from "./components/DownloadBar";
import TaskDataVisualizationComponent from "./components/TaskDataVisualization";

// interface
import {ITaskInfoProps} from "../../../../../utils/interface/adminManage";

const TaskInfo = (props: ITaskInfoProps) => {
  const {loading} = props
  const {taskId} = useParams()

  const chartsRef = useRef<HTMLDivElement>(null);
  const [pageContent, setPageContent] = useState<'main' | 'codeStatus'>('main')

  return (
    <div className='w-[100vw] h-[100vh] p-4 animate-messageSlideIn'>
      <Button variant='gradient' color='red' className='mb-4' placeholder={undefined}
              onClick={() => window.history.back()}>返回</Button>
      <div className='h-[90%] p-10 bg-stamindTask-white-100 rounded-xl shadow-lg shadow-black/50'>
        <DownloadBarComponent taskId={taskId} loading={loading} setPageContent={setPageContent} chartsRef={chartsRef}/>
        {pageContent === 'main' &&
            <TaskDataVisualizationComponent taskId={taskId} loading={loading} chartsRef={chartsRef}/>}
      </div>
    </div>
  )
}

export default TaskInfo