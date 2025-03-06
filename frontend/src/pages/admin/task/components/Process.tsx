import {useState, useEffect, useRef} from 'react';
// style
import {Carousel, IconButton} from "@material-tailwind/react"
// API

// components
import AlertMsg from "../../../../components/Alert/Alert";
import FileUploadComponent from "../../../../components/FileUpload/FileUpload";

// interface
import {ITaskProcessProps} from "../../../../utils/interface/Task";
import {API_uploadTaskExperienceFile} from "../../../../utils/API/API_Experiences";
import {API_getTextBookFile, API_uploadTextBookFile} from "../../../../utils/API/API_TextBooks";

const ProcessComponent = (props: ITaskProcessProps) => {
  const {taskId, selectNode} = props

  const [textBookData, setTextBookData] = useState<string>("")
  const [textBookAmount, setTextBookAmount] = useState<number>(0)
  const [textBookDir, setTextBookDir] = useState<string>("")

  const [caroselImgList, setCaroselImgList] = useState<Array<string>>([])

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  // 參考 input 元素
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload file
  const handleUploadFile = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      if (fileInputRef.current.files.length === 0) {
        setAlertOpen(true)
        setAlertContent("未選擇檔案")
        return
      }

      const file = fileInputRef.current.files[0]
      setAlertOpen(true)
      setAlertContent("🟠上傳中...")
      API_uploadTextBookFile(taskId || '', file, selectNode.key).then(response => {
        setAlertOpen(true)
        setAlertContent(`🟢上傳成功, 檔案路徑為：${response.data.file_dir}, 共 ${response.data.file_amount} 頁`)
        setTextBookData(response.data.file_name)
        setTextBookAmount(parseInt(response.data.file_amount))
        setTextBookDir(response.data.file_dir)
      })
    }
  }

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
  }, []);

  useEffect(() => {
    const newCaroselImgList = Array.from({length: textBookAmount}).map(
      (_, i) => `${textBookDir}/page_${i + 1}.jpg?ts=${Date.now()}`
    )
    setCaroselImgList(newCaroselImgList)
    console.log(newCaroselImgList, textBookAmount)
  }, [textBookAmount]);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <FileUploadComponent handleUploadFile={handleUploadFile} fileInputRef={fileInputRef} setAlertOpen={setAlertOpen}
                           type={'PDF2images'} setAlertContent={setAlertContent} setFileData={setTextBookData}/>
      <div className='max-h-[70vh] overflow-scroll'>
        {caroselImgList.length != 0 ? (
          <Carousel
            className="rounded-xl w-full"
            prevArrow={({handlePrev}) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4"
                placeholder={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="black"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
              </IconButton>
            )}
            nextArrow={({handleNext}) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 !right-4 -translate-y-2/4"
                placeholder={undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="black"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </IconButton>
            )}
            navigation={({setActiveIndex, activeIndex, length}) => (
              <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                {new Array(length).fill("").map((_, i) => (
                  <span
                    key={i}
                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] shadow-md ${activeIndex === i ? "w-8 bg-white shadow-black" : "w-4 bg-white/50 shadow-black/50"}`}
                    onClick={() => setActiveIndex(i)}/>
                ))}
              </div>
            )} placeholder={undefined}>
            {
              caroselImgList.map((link, index) => (
                <img
                  key={index}
                  src={`/files/text_book/${link}`}
                  alt={`page_${index + 1}`}
                  className="object-fill object-center text-center"
                />
              ))
            }
          </Carousel>
        ) : (
          <p>目前無上傳檔案</p>
        )}
      </div>
    </div>
  )
}

export default ProcessComponent