import React from "react";
// style
import {Checkbox, Typography} from "@material-tailwind/react";
import {ITaskSubTarget} from "../../utils/interface/Task";
// API

// components

// interface
interface CheckBoxListProps {
  value: ITaskSubTarget
  title: string
  description?: string
  selectSubList: boolean
  setSelectSubList: React.Dispatch<React.SetStateAction<Array<boolean>>>
  index: number
}

const CheckBoxListComponent = (props: CheckBoxListProps) => {
  const {value, title, description, selectSubList, setSelectSubList, index} = props

  const handleChange = (e: any) => {
    setSelectSubList((prev) => {
      const newList = [...prev];
      newList[index] = e.target.checked; // 更新選中的狀態
      return newList;
    });
  };
  console.log(selectSubList)
  return (
    <Checkbox
      checked={selectSubList}
      onClick={handleChange}
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
      value={value.title}
      crossOrigin={undefined}
    />
  )
}
export default CheckBoxListComponent