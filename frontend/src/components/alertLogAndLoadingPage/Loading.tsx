// style
import {
  Spinner,
  Dialog
} from "@material-tailwind/react";
// API

// components

// interface
interface ILoadingProps {
  loadingOpen: boolean;
}

const Loading = (props: ILoadingProps) => {
  const {loadingOpen} = props;
  return (
    <Dialog
      open={loadingOpen} placeholder={undefined} handler={() => {}}
      className='flex justify-center items-center bg-transparent shadow-none'
    >
      <Spinner className="h-20 w-20 text-stamindTask-black-800" color='blue'/>
    </Dialog>
  )
}

export default Loading;