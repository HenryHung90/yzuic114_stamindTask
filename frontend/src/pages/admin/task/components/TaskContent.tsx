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
import ProcessComponent from "./Process";
import ReflectionComponent from "./Reflection";

// interface
import {ITaskContentProps} from "../../../../utils/interface/Task";

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
    if (selectNode.category) handleOpen()
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
        {selectNode.category === 'Process' &&
            <ProcessComponent taskId={taskId} selectNode={selectNode} savingTrigger={savingTrigger}
                              settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
        {selectNode.category === 'Reflection' &&
            <ReflectionComponent taskId={taskId} selectNode={selectNode} savingTrigger={savingTrigger}
                                 settingAlertLogAndLoading={settingAlertLogAndLoading}/>
        }
      </DialogBody>
      <DialogFooter placeholder={undefined} className='gap-x-2'>
        {(selectNode.category === 'Target' || selectNode.category === 'Reflection' || selectNode.category === 'Process') &&
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