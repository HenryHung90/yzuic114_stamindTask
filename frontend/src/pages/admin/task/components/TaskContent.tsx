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

// interface
interface ITaskContent {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

const TaskContentComponent = (props: ITaskContent) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props;
  const [open, setOpen] = useState(false)

  // 用於重整 iframe 的 key
  const [iframeKey, setIframeKey] = useState<number>(0);

  const handleOpen = () => setOpen(!open)

  // 重整 iframe 的函式
  const reloadIframe = () => {
    setIframeKey((prevKey) => prevKey + 1); // 每次更新 key，強制 iframe 重整
  };

  useEffect(() => {
    if (selectNode.category) {
      handleOpen()
      // 總共有 6 步驟，計算是第幾個
      selectNode.key = Math.floor(Math.abs(selectNode.key) / 7)
    }
  }, [selectNode]);

  return (
    <Dialog open={open} handler={handleOpen} placeholder={undefined} size='xl'>
      <DialogHeader placeholder={undefined}>{selectNode.text}</DialogHeader>
      <DialogBody placeholder={undefined}>
        {selectNode.category === 'Experience' && <ExperiencePageComponent taskId={taskId} selectNode={selectNode}
                                                                          settingAlertLogAndLoading={settingAlertLogAndLoading}
                                                                          iframeKey={iframeKey}/>}
      </DialogBody>
      <DialogFooter placeholder={undefined} className='gap-x-2'>
        <Button variant="gradient" color="green" onClick={reloadIframe} placeholder={undefined}>
          <span>Reset</span>
        </Button>
        <Button variant="gradient" color="red" onClick={handleOpen} placeholder={undefined}>
          <span>Leave</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default TaskContentComponent