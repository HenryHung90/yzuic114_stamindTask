import {useEffect, useState} from "react";
import {Button, Dialog, DialogBody, DialogFooter, DialogHeader,} from "@material-tailwind/react";
// style
// API
// components
import ExperiencePageComponent from "./Experience";
import TargetComponent from "./Target";
import PlanComponent from "./Plan";
import ProcessComponent from "./Process";
import ReflectionComponent from "./Reflection";
import FeedbackComponent from "./Feedback";

// interface
import {ITaskContentProps} from "../../../utils/interface/Task";
import {EGroupType} from "../../../utils/functions/common";

const TaskContentComponent = (props: ITaskContentProps) => {
  const {
    taskId,
    studentId,
    groupType,
    selectNode,
    setSelectNode,
    setTempStudentRecords,
    settingAlertLogAndLoading
  } = props;
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
    if (open) {
      setSelectNode?.(prevState => {
        const newState = {...prevState}
        newState.category = ''
        newState.text = ''
        return newState
      })
    }
  }

  // 用於重整 iframe 的 key
  const [iframeKey, setIframeKey] = useState<number>(0);
  // 重整 iframe 的函式
  const reloadIframe = () => {
    setIframeKey((prevKey) => prevKey + 1); // 每次更新 key，強制 iframe 重整
  };

  // saving trigger
  const [savingTrigger, setSavingTrigger] = useState<number>(0)
  const handleSavingTriggerClick = () => {
    setSavingTrigger(prevState => prevState + 1)
    setTimeout(() => {
      setSavingTrigger(0)
    }, 500)
  }

  useEffect(() => {
    if (selectNode.category) {
      if((selectNode.category == 'Plan' || selectNode.category == 'Reflection') && groupType === EGroupType.CONTROL) return
      handleOpen()
    }
  }, [selectNode]);

  return (
    <Dialog open={open} handler={() => {
    }} placeholder={undefined} size='xl'>
      <DialogHeader placeholder={undefined}>{selectNode.text}</DialogHeader>
      <DialogBody placeholder={undefined}>
        {selectNode.category === 'Experience' &&
            <ExperiencePageComponent taskId={taskId} selectNode={selectNode}
                                     settingAlertLogAndLoading={settingAlertLogAndLoading}
                                     iframeKey={iframeKey}/>
        }
        {selectNode.category === 'Target' &&
            <TargetComponent taskId={taskId} selectNode={selectNode}
                             settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
        {/*實驗組才可以使用 Plan*/}
        {(selectNode.category === 'Plan' && groupType === EGroupType.EXPERIMENTAL) &&
            <PlanComponent taskId={taskId} selectNode={selectNode}
                           studentId={studentId}
                           setTempStudentRecords={setTempStudentRecords}
                           savingTrigger={savingTrigger}
                           settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
        {selectNode.category === 'Process' &&
            <ProcessComponent taskId={taskId} selectNode={selectNode}
                              studentId={studentId}
                              setTempStudentRecords={setTempStudentRecords}
                              settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
        {
          selectNode.category === 'Reflection' &&
            <ReflectionComponent savingTrigger={savingTrigger} taskId={taskId} selectNode={selectNode}
                                 studentId={studentId}
                                 setTempStudentRecords={setTempStudentRecords}
                                 settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
        {
          selectNode.category === 'Feedback' &&
            <FeedbackComponent taskId={taskId} selectNode={selectNode}
                               studentId={studentId}
                               groupType={groupType}
                               setTempStudentRecords={setTempStudentRecords}
                               settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
      </DialogBody>
      <DialogFooter placeholder={undefined} className='gap-x-2'>
        {selectNode.category === 'Experience' &&
            <Button variant="gradient" color="green" onClick={reloadIframe} placeholder={undefined}>
                <span>Reset</span>
            </Button>
        }
        {selectNode.category === 'Plan' &&
            <Button variant="gradient" color="green" onClick={handleSavingTriggerClick} placeholder={undefined}>
                <span>Save</span>
            </Button>
        }
        {selectNode.category === 'Reflection' &&
            <Button variant="gradient" color="green" onClick={handleSavingTriggerClick} placeholder={undefined}>
                <span>Save</span>
            </Button>
        }
        <Button variant="gradient" color="red" onClick={handleOpen} placeholder={undefined}>
          <span>Leave</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default TaskContentComponent