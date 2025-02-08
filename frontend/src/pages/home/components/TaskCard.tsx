// style
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {useNavigate} from "react-router-dom";
// API

// components

// interface
interface ITaskCardProps {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const TaskCardComponent = (props: ITaskCardProps) => {
  const {id, name, created_at, updated_at} = props
  const NavLocation = useNavigate()

  function handleEnterClass() {
    NavLocation(`/task/${id}`)
  }

  return (
    <Card className="mt-6 w-72 animate-loginSlideIn delay-700" placeholder={undefined}>
      <CardHeader color="blue-gray" className="relative h-42" placeholder={undefined}>
        <img
          src="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
          alt="card-image"
        />
      </CardHeader>
      <CardBody placeholder={undefined}>
        <Typography variant="h5" color="blue-gray" className="mb-2" placeholder={undefined}>
          {name}
        </Typography>
        <Typography className='text-sm' placeholder={undefined}>
          <p>建立時間：{created_at}</p>
          <p>更新時間：{updated_at}</p>
        </Typography>
      </CardBody>
      <CardFooter placeholder={undefined}>
        <Button variant="gradient" placeholder={undefined} onClick={handleEnterClass}>進入課程</Button>
      </CardFooter>
    </Card>
  )
}

export default TaskCardComponent