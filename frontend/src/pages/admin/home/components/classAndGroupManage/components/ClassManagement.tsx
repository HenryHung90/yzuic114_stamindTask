import {useState, useEffect} from "react";
// style
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter, Typography,
} from "@material-tailwind/react";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
// API

// components

// interface
interface IClassManagementProps {
  open: boolean
  handleOpen: () => void
  classWithStudentList: Res_classWithStudentsInfo | undefined
}

interface IGroupData {
  [key: string]: {
    id: string;
    title: string;
    students: Res_studentsInfo[];
  };
}

import {Res_classWithStudentsInfo, Res_studentsInfo} from "../../../../../../utils/API/API_Interface";

const ClassManagementComponent = (props: IClassManagementProps) => {
  const {open, handleOpen, classWithStudentList} = props;

  const [groups, setGroups] = useState<IGroupData>({});

  // 初始化群組資料
  useEffect(() => {
    if (classWithStudentList) {
      const initialGroups: IGroupData = {
        unassigned: {
          id: "unassigned",
          title: "尚未分配",
          students: [],
        },
      };

      // 建立所有群組
      classWithStudentList.group_list.forEach((groupName) => {
        initialGroups[groupName] = {
          id: groupName,
          title: groupName,
          students: [],
        };
      });

      // 分配學生到對應群組
      classWithStudentList.student_list.forEach((student) => {
        if (student.group_type && initialGroups[student.group_type]) {
          initialGroups[student.group_type].students.push(student);
        } else {
          initialGroups.unassigned.students.push(student);
        }
      });

      setGroups(initialGroups);
      console.log(initialGroups);
    }
  }, [classWithStudentList]);

  const onDragEnd = (result: any) => {
    const {source, destination} = result;

    // 如果沒有目的地或拖曳到原位置，不做任何處理
    if (!destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)) {
      return;
    }

    const sourceGroup = groups[source.droppableId];
    const destGroup = groups[destination.droppableId];
    const [movedStudent] = sourceGroup.students.splice(source.index, 1);
    destGroup.students.splice(destination.index, 0, movedStudent);

    setGroups({...groups});
  };

  return (
    <Dialog open={open} size="xl" handler={handleOpen} placeholder={undefined}>
      <DialogHeader placeholder={undefined}>班級：{classWithStudentList?.class_name}</DialogHeader>
      <DialogBody placeholder={undefined}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="candidate">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
        </DragDropContext>
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button variant="gradient" color="red" placeholder={undefined} onClick={handleOpen}>
          <span>關閉</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default ClassManagementComponent