import React from "react";
// style
import {Checkbox, Typography} from "@material-tailwind/react";
import {ITaskSubTarget} from "../../utils/interface/Task";
// API

// components

// interface
interface CheckBoxListProps {
  value: ITaskSubTarget[]
  title: string
  description?: string
  selectSubList: boolean[]
  setSelectSubList: React.Dispatch<React.SetStateAction<Array<boolean>>>
  index: number
  isDisabled?: boolean
}

const CheckBoxListComponent = (props: CheckBoxListProps) => {
  const {value, title, description, selectSubList, setSelectSubList, index, isDisabled = true} = props

  const handleChange = (e: any) => {
    setSelectSubList((prev) => {
      const newList = [...prev];
      newList[index] = e.target.checked; // 更新選中的狀態
      return newList;
    });
  };
  return (
    <Checkbox
      checked={selectSubList[index]}
      onChange={handleChange}
      {...(isDisabled ? {} : {disabled: true})}
      label={
        <div>
          <Typography color="blue-gray" className="font-medium !min-w-[8rem]" placeholder={undefined}>
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal" placeholder={undefined}>
            {description}
          </Typography>
        </div>
      }
      containerProps={{
        className: "-mt-5",
      }}
      value={value[index].title}
      crossOrigin={undefined}
      data-action='click'
      data-type='checkbox'
      data-object={`plan_${selectSubList[index] ? `取消選擇子任務 ${title}` : `選擇子任務 ${title}`}`}
      data-id='task_planSelectCheckBox'
    />
  )
}
export default CheckBoxListComponent