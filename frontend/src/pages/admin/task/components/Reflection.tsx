import {useEffect, useState} from "react";
// style

// API

// components
import AlertMsg from "../../../../components/Alert/Alert";

// interface
import {ITaskReflectionProps, IReflection} from "../../../../utils/interface/Task";
import {Button, Input} from "@material-tailwind/react";
import {API_getReflectionQuestions, API_saveReflectionQuestions} from "../../../../utils/API/API_ReflectionQuestions";
import {API_uploadTaskTarget} from "../../../../utils/API/API_Targets";


const ReflectionComponent = (props: ITaskReflectionProps) => {
  const {taskId, selectNode, savingTrigger} = props

  const [reflectionQuestions, setReflectionQuestions] = useState<Array<IReflection>>([])

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  const handleAddNewSubTarget = () => {
    setReflectionQuestions(prevState => {
      return [...prevState, {title: ''}]
    })
  }

  // 更新陣列中的內容
  const handleEditReflectionQuestions = (index: number, key: 'title', value: string) => {
    setReflectionQuestions(prevState => {
      const updateList = [...prevState]
      updateList[index] = {
        ...updateList[index],
        [key]: value,
      }
      return updateList
    })
  }

  // 刪除陣列中的內容
  const handleDeleteReflectionQuestions = (index: number) => {
    setReflectionQuestions(prevState => prevState.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const fetchReflectionQuestions = async () => {
      API_getReflectionQuestions(taskId || '').then(response => {
        setReflectionQuestions(response.data.reflection_question_list[selectNode.key] ?? [])
      })
    }
    fetchReflectionQuestions()
  }, []);

  useEffect(() => {
    const saveReflectionQuestions = async () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_saveReflectionQuestions(taskId || '', selectNode.key, reflectionQuestions).then(response => {
        setAlertContent(`🟢更新成功:${response.message}`)
      })
    }
    if (savingTrigger > 0) saveReflectionQuestions()
  }, [savingTrigger])

  return (
    <div className='flex flex-col items-center'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 w-[80%] h-96 border-stamindTask-black-850'>
        {reflectionQuestions.length > 0 && reflectionQuestions.map(({title}, index) => (
            <div className='flex p-4 gap-y-3 border-[1px] border-stamindTask-black-600 rounded-md'>
              <Input
                variant="standard"
                label={`反思題目${index + 1}`}
                placeholder="請輸入反思題目"
                crossOrigin={undefined}
                value={title}
                onChange={(e) => handleEditReflectionQuestions(index, 'title', e.target.value)}
              />
              <Button
                variant="gradient"
                placeholder={undefined}
                color='red'
                size='sm'
                className='flex items-center text-center w-14'
                onClick={(e) => handleDeleteReflectionQuestions(index)}
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
        )}
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleAddNewSubTarget}
          className='min-h-11'
        >
          新增反思題目
        </Button>
      </div>
    </div>
  )
}

export default ReflectionComponent