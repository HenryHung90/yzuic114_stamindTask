import React, {useState, useEffect} from "react";
// style
import {
  Card,
  List,
  ListItem,
  Typography,
  Select,
  Option,
  Textarea,
  Input,
  Button,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@material-tailwind/react";
import {
  CubeIcon,
  QueueListIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/solid";

// API
import {API_getTaskTarget} from "../../../utils/API/API_Targets";
import {API_getTaskPlan} from "../../../utils/API/API_StudentTaskPlans";

// components
import AlertMsg from "../../../components/Alert/Alert";
import CheckBoxListComponent from "../../../components/CheckBoxList/CheckBoxList";

// interface
import {
  ITaskPlanProps,
  ITaskSubTarget,
  ITaskPlan,
  ITaskPlanContentProps,
  ITaskSubTargetLisProps
} from "../../../utils/interface/Task"
import {API_uploadTaskPlan} from "../../../utils/API/API_StudentTaskPlans";

const STRATEGY = [
  {value: 'environment', name: '環境制定'},
  {value: 'learning_strategy', name: '學習策略'},
  {value: 'time_management', name: '時間管理'},
  {value: 'finding_help', name: '尋求協助'},
  {value: 'self_assessment', name: '自我評估'}
]

// 子目標列舉
const SubTargetListComponent = (props: ITaskSubTargetLisProps) => {
  const {subTargetList, selectSubList, setSelectSubList} = props
  return (
    <Card className="w-full max-w-[35rem]" placeholder={undefined}>
      <List className="flex-row" placeholder={undefined}>
        {
          subTargetList.map(({title, description}, index) => {
            return (
              <ListItem className="" key={index} placeholder={undefined}>
                <CheckBoxListComponent
                  selectSubList={selectSubList[index]}
                  setSelectSubList={setSelectSubList}
                  value={subTargetList[index]}
                  index={index}
                  title={title}
                  description={description}
                />
              </ListItem>
            )
          })
        }
      </List>
    </Card>
  )
}

// 計畫設定內容
const PlanContentComponent = (props: ITaskPlanContentProps) => {
  const {plan, handleChangePlanList, handleDeletePlanList, subTargetIndex, planIndex} = props

  return (
    <TimelineItem>
      <TimelineConnector/>
      <TimelineHeader>
        <TimelineIcon className="p-2">
          {plan.strategy == 'environment' && <CubeIcon className='h-4 w-4'/>}
          {plan.strategy == 'learning_strategy' && <QueueListIcon className='h-4 w-4'/>}
          {plan.strategy == 'time_management' && <CalendarDaysIcon className='h-4 w-4'/>}
          {plan.strategy == 'finding_help' && <UserGroupIcon className='h-4 w-4'/>}
          {plan.strategy == 'self_assessment' && <DocumentCheckIcon className='h-4 w-4'/>}
        </TimelineIcon>
      </TimelineHeader>
      <TimelineBody>
        <div className='flex justify-between w-72 mb-2'>
          <div className='w-24'>
            <Select
              label="策略選擇"
              placeholder={undefined}
              value={plan ? plan.strategy : 'environment'}
              onChange={(value) => {
                const validStrategyContent = ['environment', 'learning_strategy', 'time_management', 'finding_help', 'self_assessment']
                if (validStrategyContent.includes(value || 'environment')) {
                  handleChangePlanList('strategy', value || 'environment', subTargetIndex, planIndex)
                }
              }}
            >
              {
                STRATEGY.map(({value, name}, index) => (
                  <Option key={index} value={value}>{name}</Option>
                ))
              }
            </Select>
          </div>
          <Button
            variant="gradient"
            placeholder={undefined}
            color='red'
            size='sm'
            className='flex items-center text-center w-14'
            onClick={(e) => handleDeletePlanList(subTargetIndex, planIndex)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor"
                 className="size-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
            </svg>
          </Button>
        </div>
        {plan.strategy === 'time_management' &&
            <div className='w-20 my-2'>
                <Input
                    type="date"
                    label="選擇時間"
                    value={plan.time}
                    onChange={(e) => handleChangePlanList('time', e.target.value, subTargetIndex, planIndex)}
                    crossOrigin={undefined}
                />
            </div>
        }
        <div className='w-[60vw]'>
          <Textarea label="策略描述" value={plan.description}
                    onChange={(e) => handleChangePlanList('description', e.target.value, subTargetIndex, planIndex)
                    }/>
        </div>
      </TimelineBody>
    </TimelineItem>
  )
}


const PlanComponent = (props: ITaskPlanProps) => {
  const {taskId, selectNode, savingTrigger, settingAlertLogAndLoading} = props

  // Target 相關資訊
  const [subTargetList, setSubTargetList] = useState<Array<ITaskSubTarget>>([])
  // 選擇的子目標
  const [selectSubList, setSelectSubList] = useState<Array<boolean>>([])

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  // 策略制定內容
  const [planList, setPlanList] = useState<Array<Array<ITaskPlan>>>([[]])
  // 處理個別子目標中的增刪計畫設定-----------------------
  const handleChangePlanList = (field: 'strategy' | 'description' | 'time', value: string, subTargetIndex: number, planIndex: number) => {
    setPlanList((prevState) => {
      const updatedList = [...prevState]

      // 確保 subTargetIndex 對應的項目存在
      if (updatedList[subTargetIndex]) {
        const subTargetPlans = [...updatedList[subTargetIndex]]

        // 確保 planIndex 對應的項目存在
        if (subTargetPlans[planIndex]) {
          subTargetPlans[planIndex] = {
            ...subTargetPlans[planIndex],
            [field]: value // 動態更新字段
          }
        }
        updatedList[subTargetIndex] = subTargetPlans
      }
      return updatedList
    })
  }
  const handleAddNewPlan = (subTargetIndex: number) => {
    setPlanList((prevState) => {
      const updatedList = [...prevState]
      // 新增一個默認的計劃
      const newPlan: ITaskPlan = {
        strategy: 'environment',
        description: '',
        time: '',
      };

      updatedList[subTargetIndex] = [...updatedList[subTargetIndex], newPlan];
      return updatedList
    })
  }
  const handleDeletePlan = (subTargetIndex: number, planIndex: number) => {
    setPlanList((prevState) => {
      const updatedList = [...prevState]

      // 確保 subTargetIndex 對應的項目存在
      if (updatedList[subTargetIndex]) {
        // 複製子目標計劃的列表
        const subTargetPlans = [...updatedList[subTargetIndex]];

        // 確保 planIndex 對應的項目存在
        if (subTargetPlans[planIndex]) {
          // 刪除指定的計劃
          subTargetPlans.splice(planIndex, 1);
        }

        // 更新子目標的計劃列表
        updatedList[subTargetIndex] = subTargetPlans;
      }
      return updatedList
    })
  }
  //----------------------------------------------

  // 儲存 Plan
  useEffect(() => {
    const uploadTaskPlan = async () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_uploadTaskPlan(taskId || '', selectNode.key, selectSubList, planList).then(response => {
        setAlertContent("🟢更新成功")
      })
    }
    if (savingTrigger > 0) uploadTaskPlan()
  }, [savingTrigger])

  // init 計畫設定內容
  useEffect(() => {
    const fetchTaskPlan = async () => {
      setAlertOpen(true)
      setAlertContent("🟠取得計畫設定內容...")
      API_getTaskPlan(taskId || '').then(response => {
        console.log(response.data)
        setSelectSubList(response.data.select_sub_list[selectNode.key])
        setPlanList(response.data.plan_list[selectNode.key])
        setAlertContent("🟢取得計畫設定內容成功")
      })
    }
    const fetchSubTarget = async () => {
      setAlertOpen(true)
      setAlertContent("🟠取得子目標中...")
      await API_getTaskTarget(taskId || '').then(response => {
        setSubTargetList(response.data.sub_target_list[selectNode.key])
        setSelectSubList(new Array(response.data.sub_target_list.length).fill(false))
        setPlanList(new Array(response.data.sub_target_list.length).fill([{strategy: 'environment', description: ''}]))
        setAlertContent("🟢取得子目標成功")
      })
      fetchTaskPlan()
    }

    fetchSubTarget()
  }, []);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div>
        <p className='text-xl'>選擇欲達成之子目標</p>
        <SubTargetListComponent subTargetList={subTargetList} selectSubList={selectSubList}
                                setSelectSubList={setSelectSubList}/>
      </div>
      <div className='max-h-[55vh] overflow-scroll flex flex-col mt-5 gap-y-2'>
        {
          selectSubList.map((selected, subTargetIndex) => {
            if (selected) {
              return (
                <div key={subTargetIndex} className='w-full py-5 border-b-2 border-stamindTask-black-850'>
                  <Typography color="blue-gray" className="font-bold text-[1.5rem]" placeholder={undefined}>
                    子目標：{subTargetList[subTargetIndex].title}
                  </Typography>
                  <div className='w-[95%] m-auto'>
                    <Timeline>
                      {planList[subTargetIndex].map((plan, planIndex) => {
                        return (
                          <PlanContentComponent plan={plan} subTargetIndex={subTargetIndex} planIndex={planIndex}
                                                handleChangePlanList={handleChangePlanList}
                                                handleDeletePlanList={handleDeletePlan}
                          />
                        )
                      })}
                    </Timeline>
                  </div>
                  <Button
                    variant="gradient"
                    placeholder={undefined}
                    onClick={() => handleAddNewPlan(subTargetIndex)}
                    className='min-h-11'
                  >
                    新增策略
                  </Button>
                </div>
              )
            }
          })
        }
      </div>
    </div>
  )
}

export default PlanComponent