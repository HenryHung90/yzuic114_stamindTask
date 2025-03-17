import {useState, useEffect, useRef} from 'react';
// style
// API

// components
import AlertMsg from "../../../../components/Alert/Alert";
import FileUploadComponent from "../../../../components/FileUpload/FileUpload";
import CarouselComponent from "../../../../components/Carousel/Carousel";

// interface
import {ITaskProcessProps} from "../../../../utils/interface/Task";
import {API_getTextBookFile, API_uploadTextBookFile} from "../../../../utils/API/API_TextBooks";

const ProcessComponent = (props: ITaskProcessProps) => {
  const {taskId, selectNode} = props

  const [textBookData, setTextBookData] = useState<string>("")
  const [textBookAmount, setTextBookAmount] = useState<number>(0)
  const [textBookDir, setTextBookDir] = useState<string>("")

  const [carouselImgList, setCarouselImgList] = useState<Array<string>>([])

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
    const newCarouselImgList = Array.from({length: textBookAmount}).map(
      (_, i) => `${textBookDir}/page_${i + 1}.jpg?ts=${Date.now()}`
    )
    setCarouselImgList(newCarouselImgList)
    console.log(newCarouselImgList, textBookAmount)
  }, [textBookAmount]);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <FileUploadComponent handleUploadFile={handleUploadFile} fileInputRef={fileInputRef} setAlertOpen={setAlertOpen}
                           type={'PDF2images'} setAlertContent={setAlertContent} setFileData={setTextBookData}/>
      <div className='max-h-[70vh] overflow-scroll'>
        <CarouselComponent carouselImgList={carouselImgList}/>
      </div>
    </div>
  )
}

export default ProcessComponent