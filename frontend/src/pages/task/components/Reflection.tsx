import {useState, useEffect} from "react";
// style
import {Typography, Textarea} from "@material-tailwind/react";

// API
import {API_getReflectionQuestions} from "../../../utils/API/API_ReflectionQuestions";
import {
  API_getStudentTaskReflections,
  API_saveStudentTaskReflections
} from "../../../utils/API/API_StudentTaskReflections";

// components
import AlertMsg from "../../../components/Alert/Alert";

// interface
import {IReflection, IStudentReflection, ITaskReflectionProps} from "../../../utils/interface/Task";
import {handleCustomRecord} from "../../../utils/listener/action";


const ReflectionComponent = (props: ITaskReflectionProps) => {
  const {taskId, selectNode, savingTrigger, studentId, setTempStudentRecords} = props

  // 反思題目
  const [reflectionQuestions, setReflectionQuestions] = useState<Array<IReflection>>([])
  // 學生回覆
  const [reflectionResponses, setReflectionResponses] = useState<Array<IStudentReflection>>([])

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  // 更新陣列中的內容
  const handleEditStudentReflection = (index: number, key: 'reflect', value: string) => {
    setReflectionResponses(prevState => {
      const updateList = [...prevState]
      updateList[index] = {
        ...updateList[index],
        [key]: value,
      }
      return updateList
    })
    handleCustomRecord({
      action: 'input',
      type: 'inputField',
      object: `changeReflection_${reflectionQuestions[index].title}反思內容更改為${value}`,
      id: 'task_changeReflection'
    }, true, studentId || '', setTempStudentRecords)
  }

  useEffect(() => {
    // 取得反思題目
    const fetchReflectionQuestions = async () => {
      API_getReflectionQuestions(taskId || '').then(response => {
        setReflectionQuestions(response.data.reflection_question_list[selectNode.key] ?? [])
      })
    }
    // 取得學生已填寫內容
    const fetchStudentResponses = async () => {
      API_getStudentTaskReflections(taskId || '').then(response => {
        setReflectionResponses(response.data.reflect_list[selectNode.key] ?? [])
      })
    }
    fetchReflectionQuestions()
    fetchStudentResponses()
  }, [])

  useEffect(() => {
    const saveStudentReflection = async () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_saveStudentTaskReflections(taskId || '', selectNode.key, reflectionResponses).then(response => {
        setAlertContent(`🟢更新成功:${response.message}`)
      })
      // 紀錄儲存
      handleCustomRecord({
        action: 'click',
        type: 'button',
        object: 'saveReflection',
        id: 'task_saveReflection'
      }, false, studentId || '', setTempStudentRecords)
    }
    if (savingTrigger > 0) saveStudentReflection()
  }, [savingTrigger])

  return (
    <div className='flex flex-col items-center'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='overflow-scroll flex flex-col gap-y-5 mt-5 pt-4 w-[80%] h-96 border-stamindTask-black-850'>
        {reflectionQuestions.length > 0 && reflectionQuestions.map(({title}, index) => (
            <div className='flex flex-col p-4 gap-y-3 border-[1px] border-stamindTask-black-600 rounded-md'>
              <Typography variant='h3' placeholder={undefined}>{title}</Typography>
              <Textarea
                variant="outlined"
                label={`反思回覆${index + 1}`}
                value={reflectionResponses[index] ? reflectionResponses[index].reflect : ""}
                onChange={(e: any) => handleEditStudentReflection(index, 'reflect', e.target.value)}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ReflectionComponent