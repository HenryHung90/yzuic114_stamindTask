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
interface ITaskContent {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const TaskContentComponent = (props: ITaskContent) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props;
  const [open, setOpen] = useState(false)

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
      </DialogBody>
      <DialogFooter placeholder={undefined} className='gap-x-2'>
        <Button variant="gradient" color="red" onClick={handleOpen} placeholder={undefined}>
          <span>Leave</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default TaskContentComponent