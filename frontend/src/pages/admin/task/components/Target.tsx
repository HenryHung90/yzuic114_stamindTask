import {useEffect, useState} from "react";
// style
import {Button, Input, Textarea} from "@material-tailwind/react";
// API
// components
import AlertMsg from "../../../../components/Alert/Alert";

// interface
import {ITaskSubTarget, ITaskSubTargetProps, ITaskTargetProps} from "../../../../utils/interface/Task";
import {API_getTaskTarget, API_uploadTaskTarget} from "../../../../utils/API/API_Targets";

const SubTargetComponent = (props: ITaskSubTargetProps) => {
  const {index, title, description, handleEditSubTargetTitle, handleDeleteSubTargetTitle} = props

  if (index === undefined) return null

  return (
    <div className='flex flex-col min-h-44 p-4 gap-y-3 border-2 border-stamindTask-black-600 rounded-2xl'>
      <Input
        variant="standard"
        label="學習子目標"
        placeholder="請輸入學習子目標"
        crossOrigin={undefined}
        value={title}
        onChange={(e) => handleEditSubTargetTitle(index, 'title', e.target.value)}
      />
      <Input
        variant="standard"
        label="子目標描述"
        placeholder="請輸入子目標描述"
        crossOrigin={undefined}
        value={description}
        onChange={(e) => handleEditSubTargetTitle(index, 'description', e.target.value)}
      />
      <Button
        variant="gradient"
        placeholder={undefined}
        color='red'
        size='sm'
        className='flex items-center text-center w-14'
        onClick={(e) => handleDeleteSubTargetTitle(index)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor"
             className="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
        </svg>
      </Button>
    </div>
  )
}


const TargetComponent = (props: ITaskTargetProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading, savingTrigger} = props

  const [targetTitle, setTargetTitle] = useState<string>("")
  const [targetDescription, setTargetDescription] = useState<string>("")
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  const handleAddNewSubTarget = () => {
    setSubTargetList(prevState => {
      return [...prevState, {title: '', description: ''}]
    })
  }

  // 更新陣列中的內容
  const handleEditSubTargetTitle = (index: number, key: 'title' | 'description', value: string) => {
    setSubTargetList(prevState => {
      const updateList = [...prevState]
      updateList[index] = {
        ...updateList[index],
        [key]: value,
      }
      return updateList
    })
  }

  // 刪除陣列中的內容
  const handleDeleteSubTargetTitle = (index: number) => {
    setSubTargetList(prevState => prevState.filter((_, i) => i !== index))
  }

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

  useEffect(() => {
    const uploadTaskTarget = async () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_uploadTaskTarget(taskId || '', selectNode.key, targetTitle, targetDescription, subTargetList).then(response => {
        setAlertContent(`🟢更新成功:${response.message}`)
      })
    }
    if (savingTrigger > 0) uploadTaskTarget()
  }, [savingTrigger])

  return (
    <div className='flex flex-col items-center'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='flex flex-col gap-y-5 w-[80%]'>
        <Input
          variant="standard"
          label="學習目標"
          placeholder="請輸入學習目標"
          crossOrigin={undefined}
          value={targetTitle}
          onChange={(e) => setTargetTitle(e.target.value)}
        />
        <Textarea
          variant="outlined"
          label="詳細描述"
          value={targetDescription}
          onChange={(e) => setTargetDescription(e.target.value)}
        />
      </div>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 w-[60%] h-96 border-stamindTask-black-850'>
        {subTargetList.map(({title, description}, index) => (
          <SubTargetComponent key={index} index={index} title={title} description={description}
                              handleEditSubTargetTitle={handleEditSubTargetTitle}
                              handleDeleteSubTargetTitle={handleDeleteSubTargetTitle}/>)
        )}
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleAddNewSubTarget}
          className='min-h-11'
        >
          新增子任務
        </Button>
      </div>
    </div>
  )
}

export default TargetComponent