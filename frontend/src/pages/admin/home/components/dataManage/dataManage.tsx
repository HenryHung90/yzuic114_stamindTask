import React, {useEffect, useRef, useState} from "react";
// style
import {
  Button, Typography, Checkbox, Card, List, ListItem, ListItemPrefix
} from "@material-tailwind/react";

// API
import {API_getAllClassNames} from "../../../../../utils/API/API_ClassName";

// components
import {IDataMangeProps} from "../../../../../utils/interface/adminManage";
import TaskDataVisualizationComponent from "./components/TaskDataVisualization";

// interface

const DataManage = (props: IDataMangeProps) => {
  const {loading} = props
  const chartsRef = useRef<HTMLDivElement>(null);

  const [classList, setClassList] = useState<Array<{ id: number, name: string }>>([])
  const [selectedClasses, setSelectedClasses] = useState<number[]>([])

  useEffect(() => {
    const fetchClassList = () => {
      loading.setLoadingOpen(true)
      API_getAllClassNames().then(response => {
        setClassList(response.data.class_info)
        loading.setLoadingOpen(false)
      })
    }
    fetchClassList()
  }, []);


  // 處理 Checkbox 選中狀態變化
  const handleCheckboxChange = (classId: number) => {
    setSelectedClasses(prevSelected => {
      if (prevSelected.includes(classId)) {
        // 如果已經選中，則取消選中
        return prevSelected.filter(id => id !== classId);
      } else {
        // 如果未選中，則添加到選中列表
        return [...prevSelected, classId];
      }
    });
  };

  return (
    <div className='w-[100vw] h-[100vh] p-4 animate-messageSlideIn'>
      <Button variant='gradient' color='red' className='mb-4' placeholder={undefined}
              onClick={() => window.history.back()}>返回</Button>
      <div className='h-[90%] p-10 bg-stamindTask-white-100 rounded-xl shadow-lg shadow-black/50'>
        <div>
          <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>課程數據</Typography>
          <Card placeholder={undefined}>
            <List placeholder={undefined} className='flex-row'>
              {classList.length > 0 && classList.map(value => {
                return (
                  <ListItem placeholder={undefined} className="p-0" onClick={() => handleCheckboxChange(value.id)}>
                    <ListItemPrefix placeholder={undefined} className="mr-3">
                      <Checkbox
                        crossOrigin={undefined}
                        label={value.name}
                        key={value.id}
                        value={value.id}
                        ripple={false}
                        checked={selectedClasses.includes(value.id)}
                      />
                    </ListItemPrefix>
                  </ListItem>
                )
              })}
            </List>
          </Card>
        </div>
        <TaskDataVisualizationComponent classList={selectedClasses} loading={loading} chartsRef={chartsRef}/>
      </div>
    </div>
  )
}

export default DataManage