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
import {ISettingAlertLogAndLoading} from "../../../../utils/interface/alertLog";
import {calculateExperienceStep} from "../../../../utils/functions/tasks/experience";

// interface
import {ITaskContentProps} from "../../../../utils/interface/Task";
import TargetComponent from "./Target";

const TaskContentComponent = (props: ITaskContentProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props;
  const [open, setOpen] = useState(false)

  // saving trigger
  const [savingTrigger, setSavingTrigger] = useState<number>(0)
  const handleSavingTriggerClick = () => {
    setSavingTrigger(prevState => prevState + 1)
    setTimeout(() => {
      setSavingTrigger(0)
    }, 500)
  }

  const handleOpen = () => setOpen(!open)

  useEffect(() => {
    if (selectNode.category) {
      handleOpen()
      // 每一個 part 有 6 步驟，計算是第幾個 part
      selectNode.key = calculateExperienceStep(selectNode.key)
    }
  }, [selectNode]);

  return (
    <Dialog open={open} handler={handleOpen} placeholder={undefined} size='xl'>
      <DialogHeader placeholder={undefined}>{selectNode.text}</DialogHeader>
      <DialogBody placeholder={undefined}>
        {selectNode.category === 'Experience' && <ExperiencePageComponent taskId={taskId} selectNode={selectNode}
                                                                          settingAlertLogAndLoading={settingAlertLogAndLoading}/>}
        {selectNode.category === 'Target' &&
            <TargetComponent taskId={taskId} selectNode={selectNode} savingTrigger={savingTrigger}
                             settingAlertLogAndLoading={settingAlertLogAndLoading}/>}
      </DialogBody>
      <DialogFooter placeholder={undefined} className='gap-x-2'>
        {selectNode.category === 'Target' &&
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