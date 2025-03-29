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
    fontSize, increaseFontSize, decreaseFontSize
  } = props

  return (
    <div className='flex gap-x-3 items-center'>
      <Typography className='text-sm font-bold' placeholder={undefined}>字體大小：{fontSize}</Typography>
      <IconButton size='sm' color='blue-gray' className='h-6 w-6' placeholder={undefined} onClick={decreaseFontSize}
                  data-action='click' data-type='button' data-object='processFontIncrease' data-id='task_processFontIncrease'
      >
        <MinusIcon className='h-5 w-5' data-action='click' data-type='button' data-object='processFontIncrease' data-id='task_processFontIncrease'/>
      </IconButton>
      <IconButton size='sm' color='blue-gray' className='h-6 w-6' placeholder={undefined} onClick={increaseFontSize}
                  data-action='click' data-type='button' data-object='processFontDecrease' data-id='task_processFontDecrease'
      >
        <PlusIcon className='h-5 w-5' data-action='click' data-type='button' data-object='processFontDecrease' data-id='task_processFontDecrease'/>
      </IconButton>
    </div>
  )
}
export default FontSizeAdjustButtonComponent