import {useEffect, useState} from "react";
// style

// API
import {API_getTaskTarget} from "../../../utils/API/API_Targets";

// components
import MarkDownTextComponent from "../../../components/MarkDownText/MarkDownText";

// interface
import {ITaskContentProps, ITaskSubTarget} from "../../../utils/interface/Task";


const TargetComponent = (props: ITaskContentProps) => {
  const {taskId, selectNode,} = props

  const [targetTitle, setTargetTitle] = useState<string>("")
  const [targetDescription, setTargetDescription] = useState<string>("")
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])

  useEffect(() => {
    const fetchTaskTarget = () => {
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
        <h3
          className='text-[2rem]'
          data-action='click'
          data-type='text'
          data-object='target'
          data-id='task_target'
        >❓學習目標：{targetTitle}</h3>
        <p
          data-action='click'
          data-type='text'
          data-object='targetDescription'
          data-id='task_targetDescription'
        >{targetDescription}</p>
      </div>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 h-[60vh] border-stamindTask-black-850'>
        {subTargetList.map(({title, description}, index) => (
          <div key={index}
               className='flex flex-col min-h-44 p-4 gap-y-3 border-2 border-stamindTask-black-600 rounded-2xl'>
            <h3
              className='text-[1.5rem]'
              data-action='click'
              data-type='text'
              data-object='subTarget'
              data-id='task_subTarget'
            >🟢 子目標：{title}</h3>
            <p
              data-action='click'
              data-type='text'
              data-object='subTargetDescription'
              data-id='task_subTargetDescription'
            >
              <MarkDownTextComponent text={description}/>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TargetComponent