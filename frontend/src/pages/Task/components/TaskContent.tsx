import {useEffect, useState} from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
// style

// API

// components
import ExperiencePageComponent from "./Experience";
import TargetComponent from "./Target";
import {calculateExperienceStep} from "../../../utils/functions/tasks/experience";

// interface
import {ITaskContentProps} from "../../../utils/interface/Task";
import PlanComponent from "./Plan";

const TaskContentComponent = (props: ITaskContentProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props;
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(!open)

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
      handleOpen()
      // 總共有 6 步驟，計算是第幾個
      selectNode.key = calculateExperienceStep(selectNode.key)
      console.log(selectNode)
    }
  }, [selectNode]);

  return (
    <Dialog open={open} handler={handleOpen} placeholder={undefined} size='xl'>
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
        {selectNode.category === 'Plan' &&
            <PlanComponent taskId={taskId} selectNode={selectNode}
                           savingTrigger={savingTrigger}
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
        <Button variant="gradient" color="red" onClick={handleOpen} placeholder={undefined}>
          <span>Leave</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default TaskContentComponent