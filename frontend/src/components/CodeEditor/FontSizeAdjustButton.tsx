// style
import {IconButton, Typography} from "@material-tailwind/react";
import {MinusIcon, PlusIcon} from "@heroicons/react/24/solid";

// API

// components

// interface
interface FunctionalButtonProps {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeAdjustButtonComponent = (props: FunctionalButtonProps) => {
  const {
    fontSize, increaseFontSize, decreaseFontSize} = props

  return (
      <div className='flex gap-x-3 items-center'>
        <Typography className='text-sm font-bold' placeholder={undefined}>字體大小：{fontSize}</Typography>
        <IconButton size='sm' color='blue-gray' className='h-6 w-6' placeholder={undefined} onClick={decreaseFontSize}>
          <MinusIcon className='h-5 w-5'/>
        </IconButton>
        <IconButton size='sm' color='blue-gray' className='h-6 w-6' placeholder={undefined} onClick={increaseFontSize}>
          <PlusIcon className='h-5 w-5'/>
        </IconButton>
      </div>
  )
}
export default FontSizeAdjustButtonComponent