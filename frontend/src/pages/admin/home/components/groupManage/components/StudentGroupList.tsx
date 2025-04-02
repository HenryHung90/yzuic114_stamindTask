import {useEffect, useState} from "react";
// style
import {Card, Button} from "@material-tailwind/react";
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
// API
// components
// interface
import {IGroupManageProps, IGroupData} from "../../../../../../utils/interface/adminManage";
import {API_getStudentGroupsByClassName} from "../../../../../../utils/API/API_StudentGroup";

const StudentGroupListComponent = (props: IGroupManageProps) => {
  const {className} = props

  const [groupData, setGroupData] = useState<IGroupData>({})
  const [newGroupName, setNewGroupName] = useState<string>("")

  const fetchStudentGroups = () => {
    if (!className || className === 'ALL') return
    API_getStudentGroupsByClassName(className).then(response => {
      setGroupData(response.data.student_group_info)
    })
  }

  useEffect(() => {
    fetchStudentGroups()
  }, [className]);

  const handleDragEnd = (result: DropResult) => {
    const {source, destination} = result;

    // 如果沒有目的地或拖拽到相同位置，不做任何處理
    if (!destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)) {
      return;
    }

    // 複製當前狀態
    const newGroupData = {...groupData};

    // 從源組別中移除學生
    const sourceGroup = newGroupData[source.droppableId];
    const [movedStudent] = sourceGroup.student_list.splice(source.index, 1);

    // 將學生添加到目標組別
    const destGroup = newGroupData[destination.droppableId];
    destGroup.student_list.splice(destination.index, 0, movedStudent);

    // 更新狀態
    setGroupData(newGroupData);
  };

  const addNewGroup = () => {
    if (!newGroupName.trim()) return;

    // const updatedGroupData = {...groupData};
    // updatedGroupData[newGroupName] = {
    //   class_name: className,
    //   group_type: "專題組",
    //   studentList: []
    // };
    //
    // setGroupData(updatedGroupData);
    setNewGroupName("");
  };

  useEffect(() => {
    console.log(groupData)
  }, [groupData]);

  return (
    <Card className="h-full w-full overflow-auto p-4" placeholder={undefined}>
      <h1 className="text-lg font-bold mb-4">學生組別管理</h1>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="新增組別名稱"
          className="border p-2 rounded mr-2"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button onClick={addNewGroup} size="sm" variant='gradient' placeholder={undefined}>
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
                      className={`min-h-24 p-2 rounded duration-500 ${
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