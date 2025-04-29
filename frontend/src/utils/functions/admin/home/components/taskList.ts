import {ITaskListFuncProps} from "../../../../interface/adminManage";
import {API_changeTaskName, API_switchTaskOpen} from "../../../../API/API_Tasks";
import {handlePromise} from "../../../common"

function handleSwitchTaskOpen(props: ITaskListFuncProps) {
  const {taskId, loading, fetchTaskListAsync} = props;

  loading.setLoadingOpen(true)
  API_switchTaskOpen(taskId).then(response => {
    handlePromise(response.message, '成功', loading, fetchTaskListAsync)
  })
}

function handleChangeTaskName(props: ITaskListFuncProps) {
  const {taskId, loading, fetchTaskListAsync} = props;
  const taskName = prompt("請輸入新名稱")
  if (taskName === "" || taskName === null) return

  loading.setLoadingOpen(true)
  API_changeTaskName(taskId, taskName).then(response => {
    handlePromise(response.message, '成功', loading, fetchTaskListAsync)
  })
}

export {handleSwitchTaskOpen, handleChangeTaskName}