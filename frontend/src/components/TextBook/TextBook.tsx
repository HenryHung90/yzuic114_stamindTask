import React, {useEffect, useState} from "react";
import {Rnd} from "react-rnd";
// style
import {XMarkIcon} from "@heroicons/react/24/solid";
import {IconButton} from "@material-tailwind/react";

// API
import {API_getTextBookFile} from "../../utils/API/API_TextBooks";

// components
import CarouselComponent from "../Carousel/Carousel";

// interface
interface ITextBookProps {
  taskId: string
  selectNode: { key: number, category: string, text: string }
  setOpenTextBook: React.Dispatch<React.SetStateAction<boolean>>
}


const TextBookComponent = (props: ITextBookProps) => {
  const {taskId, selectNode, setOpenTextBook} = props
  const [carouselImgList, setCarouselImgList] = useState<Array<string>>([])
  const [textBookAmount, setTextBookAmount] = useState<number>(0)
  const [textBookDir, setTextBookDir] = useState<string>("")

  useEffect(() => {
    const fetchTextBookFiles = async () => {
      API_getTextBookFile(taskId).then(response => {
        const fileLocation = response.data.file_dir[selectNode.key]
        const fileAmount = response.data.file_amount[selectNode.key]
        if (fileLocation) setTextBookDir(fileLocation)
        if (fileAmount) setTextBookAmount(parseInt(fileAmount))
      })
    }
    fetchTextBookFiles()
  }, [])

  useEffect(() => {
    const newCarouselImgList = Array.from({length: textBookAmount}).map(
      (_, i) => `${textBookDir}/page_${i + 1}.jpg?ts=${Date.now()}`
    )
    setCarouselImgList(newCarouselImgList)
  }, [textBookAmount])

  return (
    <div
      className="relative flex flex-col justify-between w-[100vw] h-[100vh] p-2 rounded-xl animate-tooltipSlideIn">
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: window.innerWidth * 0.3,
          height: 'auto',
        }}
        bounds="parent"
        className='pointer-events-auto'
      >
        <div className='rounded-xl shadow-lg shadow-stamindTask-primary-blue-600'>
          <CarouselComponent carouselImgList={carouselImgList}/>
          <div className='absolute right-3 top-3'>
            <IconButton
              variant="text"
              placeholder={undefined}
              onClick={() => setOpenTextBook(false)}
            >
              <XMarkIcon className='h-5 w-5 color-black'/>
            </IconButton>
          </div>
        </div>
      </Rnd>
    </div>
  )
}

export default TextBookComponent