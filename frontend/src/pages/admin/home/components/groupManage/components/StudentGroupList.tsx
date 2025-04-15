import {useEffect, useState} from "react";
// style
import {Card, Button} from "@material-tailwind/react";
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
// API
import {
  API_getStudentGroupsByClassName,
  API_updateStudentGroupByStudentId
} from "../../../../../../utils/API/API_StudentGroup";
// components
// interface
import {IGroupManageProps, IGroupData} from "../../../../../../utils/interface/adminManage";

const StudentGroupListComponent = (props: IGroupManageProps) => {
  const {className, settingAlertLogAndLoading} = props

  const [groupData, setGroupData] = useState<IGroupData>({})
  const [newGroupName, setNewGroupName] = useState<string>("")

  // 取得學生以及組別
  const fetchStudentGroups = () => {
    if (!className || className === 'ALL') return
    API_getStudentGroupsByClassName(className).then(response => {
      setGroupData(response.data.student_group_info)
    })
  }

  // 更新分組名單
  const handleUpdateStudentGroupName = (changeStudentId: string, changeGroup: string) => {
    settingAlertLogAndLoading.setLoadingOpen(true)
    API_updateStudentGroupByStudentId(className || '', changeGroup, changeStudentId).then(response => {
      if (response.message === 'success') settingAlertLogAndLoading.setLoadingOpen(false)
    })
  }

  useEffect(() => {
    fetchStudentGroups()
  }, [className])

  const handleDragEnd = (result: DropResult) => {
    const {source, destination} = result;

    // 如果沒有目的地或拖拽到相同位置，不做任何處理
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return


    // 複製當前狀態
    const newGroupData = {...groupData};

    // 從源組別中移除學生
    const sourceGroup = newGroupData[source.droppableId];
    const [movedStudent] = sourceGroup.student_list.splice(source.index, 1);

    // 將學生添加到目標組別
    const destGroup = newGroupData[destination.droppableId];
    destGroup.student_list.splice(destination.index, 0, movedStudent);

    // 更新狀態
    setGroupData(newGroupData)
    handleUpdateStudentGroupName(movedStudent.student_id, destGroup.group_type)
  };

  const handleAddNewGroup = () => {
    if (!newGroupName.trim()) return;
    // const updatedGroupData = {...groupData};
    // updatedGroupDataＦ[newGroupName] = {
    //   class_name: className,
    //   group_type: "專題組",
    //   studentList: []
    // };
    //
    // setGroupData(updatedGroupData);
    alert("功能暫不開放")
    setNewGroupName("");
  }

  return (
    <Card className="h-[70vh] w-full overflow-auto p-4" placeholder={undefined}>
      <h1 className="text-lg font-bold mb-4">學生組別管理</h1>
      <div className="w-full flex mb-4 gap-x-4">
        <Button onClick={handleAddNewGroup} size="sm" variant='gradient' placeholder={undefined}>
          新增組別
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupData).map(([groupName, group]) => {
            group.student_list = group.student_list.sort()
            return (
              <div key={groupName} className="border rounded p-3">
                <h2 className="font-bold mb-2">{groupName} ({group.group_type === 'CONTROL' ? "控制組" : "實驗組"})</h2>
                <Droppable droppableId={groupName}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`max-h-96 overflow-auto p-2 rounded duration-500 ${
                        snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      {group.student_list.map((student, index) => (
                        <Draggable
                          key={student.student_id}
                          draggableId={student.student_id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 mb-2 rounded ${
                                snapshot.isDragging
                                  ? "bg-blue-200"
                                  : "bg-white"
                              } border`}
                            >
                              {student.name} ({student.student_id})
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </Card>
  )
}

export default StudentGroupListComponent