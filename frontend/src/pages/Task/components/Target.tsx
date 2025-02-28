import {useEffect, useState} from "react";
// style

// API
import {API_getTaskTarget} from "../../../utils/API/API_Targets";

// components

// interface
import {ITaskContentProps, ITaskSubTarget} from "../../../utils/interface/Task";


const TargetComponent = (props: ITaskContentProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props

  const [targetTitle, setTargetTitle] = useState<string>("")
  const [targetDescription, setTargetDescription] = useState<string>("")
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])

  useEffect(() => {
    const fetchTaskTarget = async () => {
      API_getTaskTarget(taskId || '').then(response => {
        const title = response.data.target_titles[selectNode.key]
        const description = response.data.target_descriptions[selectNode.key]
        const subTargetList = response.data.sub_target_list[selectNode.key]

        setTargetTitle(title)
        setTargetDescription(description)
        if (subTargetList) setSubTargetList(subTargetList)
      })
    }
    fetchTaskTarget()
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col gap-y-5 w-[80%]'>
        <h3 className='text-[2rem]'>❓學習目標：{targetTitle}</h3>
        <p>{targetDescription}</p>
      </div>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 w-[60%] h-96 border-stamindTask-black-850'>
        {subTargetList.map(({title, description}, index) => (
          <div key={index} className='flex flex-col min-h-44 p-4 gap-y-3 border-2 border-stamindTask-black-600 rounded-2xl'>
            <h3 className='text-[1.5rem]'>🟢 子目標：{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TargetComponent