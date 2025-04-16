import React, {useState, useEffect} from "react";
// style
import {Typography, Textarea, Card, List, ListItem} from "@material-tailwind/react";

// API
import {API_getReflectionQuestions} from "../../../utils/API/API_ReflectionQuestions";
import {API_getTaskTarget} from "../../../utils/API/API_Targets";
import {API_getTaskPlan} from "../../../utils/API/API_StudentTaskPlans";
import {
  API_getStudentTaskReflections,
  API_saveStudentTaskReflections
} from "../../../utils/API/API_StudentTaskReflections";
import {handleCustomRecord} from "../../../utils/listener/action";

// components
import AlertMsg from "../../../components/Alert/Alert";
import CheckBoxListComponent from "../../../components/CheckBoxList/CheckBoxList";
import SliderWithMarkComponent from "../../../components/Slider/SilderWithMark";

// interface
import {
  IReflection,
  IStudentReflection,
  ITaskReflectionProps,
  ITaskSubTarget,
  ITaskSubTargetListProps
} from "../../../utils/interface/Task";

// 子目標列舉
const SubTargetListComponent = (props: ITaskSubTargetListProps) => {
  const {subTargetList, selectSubList, setSelectSubList} = props

  return (
    <Card className="w-full max-w-[50rem]" placeholder={undefined}>
      <List className="flex-row" placeholder={undefined}>
        {
          subTargetList.map(({title, description, selected}, index) => {
            return (
              <ListItem className="" key={index} ripple={false} placeholder={undefined}>
                <CheckBoxListComponent
                  selectSubList={selectSubList}
                  setSelectSubList={setSelectSubList}
                  value={subTargetList}
                  index={index}
                  title={title}
                  description={description}
                  isDisabled={selected}
                />
              </ListItem>
            )
          })
        }
      </List>
    </Card>
  )
}


const ReflectionComponent = (props: ITaskReflectionProps) => {
  const {taskId, selectNode, savingTrigger, studentId, setTempStudentRecords} = props

  // 所有子目標
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])
  // 學生完成的子目標
  const [completedTargets, setCompletedTargets] = useState<Array<boolean>>([])
  // 反思題目
  const [reflectionQuestions, setReflectionQuestions] = useState<Array<IReflection>>([])
  // 學生回覆
  const [reflectionResponses, setReflectionResponses] = useState<Array<IStudentReflection>>([])
  // 學生自我評分
  const [selfScoring, setSelfScoring] = useState<number>(5)

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

  // 監測 selfScoring
  const handleChangeSelfScoring = (e: React.ChangeEvent<HTMLInputElement>) => {
    const offsetScore = parseInt(e.currentTarget.value) / 10
    setSelfScoring(offsetScore)
    // 紀錄行為
    handleCustomRecord({
      action: 'interact',
      type: 'slideField',
      object: `changeSelfScoring_${offsetScore}分`,
      id: 'task_changeSelfScoring',
    }, false, studentId || '', setTempStudentRecords)
  }

  useEffect(() => {
    // 取得反思題目
    const fetchReflectionQuestions = () => {
      API_getReflectionQuestions(taskId || '').then(response => {
        setReflectionQuestions(response.data.reflection_question_list[selectNode.key] ?? [])
      })
    }
    // 取得學生已填寫內容
    const fetchStudentResponses = () => {
      API_getStudentTaskReflections(taskId || '').then(response => {
        if (response.data.reflect_list) setReflectionResponses(response.data.reflect_list[selectNode.key] ?? [])
        if (response.data.completed_targets) setCompletedTargets(response.data.completed_targets[selectNode.key] ?? [])
        setSelfScoring(response.data.self_scoring[selectNode.key] ?? 3)
      })
    }
    // 取得子目標
    const fetchSubTarget = (fetchSelected: () => void) => {
      API_getTaskTarget(taskId || '').then(response => {
        const subTargetList = response.data.sub_target_list[selectNode.key]
        setSubTargetList(subTargetList)
        if (!completedTargets.length) setCompletedTargets(new Array(subTargetList.length).fill(false))
        // 等待 subTargetList 取得資料後再行設定 Selected
        fetchSelected()
      })
    }
    // 取得選擇的子目標
    const fetchSelectedSubTarget = () => {
      API_getTaskPlan(taskId || '').then(response => {
        const selectedSubList = response.data.select_sub_list[selectNode.key]
        setSubTargetList(prev => {
          // 創建一個新陣列，避免直接修改原始狀態
          return prev.map((subTarget, index) => {
            // 回傳新物件，包含原有 subTarget 的所有屬性，並加入 select
            if (selectedSubList) return {...subTarget, selected: selectedSubList[index]}
            else return {...subTarget, selected: false}
          })
        })
      })
    }
    fetchReflectionQuestions()
    fetchStudentResponses()
    fetchSubTarget(fetchSelectedSubTarget)
  }, [])

  useEffect(() => {
    const saveStudentReflection = () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_saveStudentTaskReflections(taskId || '', selectNode.key, reflectionResponses, completedTargets, selfScoring).then(response => {
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
    <div className='h-[60vh] overflow-auto flex flex-col items-center'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <Typography variant='h5' placeholder={undefined}>如果你完成了任務，請勾選</Typography>
      <SubTargetListComponent subTargetList={subTargetList} selectSubList={completedTargets}
                              setSelectSubList={setCompletedTargets}/>
      <div className='flex flex-col gap-y-5 mt-5 py-4 w-[80%]'>
        {reflectionQuestions.length > 0 && reflectionQuestions.map(({title}, index) => (
            <div className='flex flex-col p-4 gap-y-3'>
              <Typography variant='h5' placeholder={undefined}>{title}</Typography>
              <Textarea
                variant="outlined"
                label={`反思回覆${index + 1}`}
                value={reflectionResponses[index] ? reflectionResponses[index].reflect : ""}
                onChange={(e: any) => handleEditStudentReflection(index, 'reflect', e.target.value)}
                rows={8}
              />
            </div>
          )
        )}
        <div className='flex flex-col items-center justify-center gap-y-8'>
          <Typography variant='h5' placeholder={undefined}>給自己的表現打個分數！</Typography>
          <div className="w-[80%] px-4 py-4">
            <SliderWithMarkComponent value={selfScoring} handleSetValue={handleChangeSelfScoring}/>
            <Typography placeholder={undefined} variant="h6" className="mt-6 text-center">
              你的分數: {selfScoring}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReflectionComponent