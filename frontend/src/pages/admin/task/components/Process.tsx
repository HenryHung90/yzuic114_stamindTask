import {useState, useEffect, useRef} from 'react';
// style
import {Button, Input, Typography} from "@material-tailwind/react";

// API
import {API_getTextBookFile, API_uploadTextBookFile} from "../../../../utils/API/API_TextBooks";
import {API_getProcessHint, API_uploadProcessHint} from "../../../../utils/API/API_ProcessHint";
// components
import AlertMsg from "../../../../components/Alert/Alert";
import FileUploadComponent from "../../../../components/FileUpload/FileUpload";
import CarouselComponent from "../../../../components/Carousel/Carousel";

// interface
import {ITaskProcessHintProps, ITaskProcessProps, ITaskProcessHint} from "../../../../utils/interface/Task";


const ProcessHintComponent = (props: ITaskProcessHintProps) => {
  const {index, title, description, handleEditProcessHint, handleDeleteProcessHint} = props

  if (index === undefined) return null

  return (
    <div className='flex flex-col min-h-44 p-4 gap-y-3 border-2 border-stamindTask-black-600 rounded-2xl'>
      <Input
        variant="standard"
        label="執行提示"
        placeholder="請輸入執行提示"
        crossOrigin={undefined}
        value={title}
        onChange={(e) => handleEditProcessHint(index, 'title', e.target.value)}
      />
      <Input
        variant="standard"
        label="執行提示描述"
        placeholder="請輸入執行提示描述"
        crossOrigin={undefined}
        value={description}
        onChange={(e) => handleEditProcessHint(index, 'description', e.target.value)}
      />
      <Button
        variant="gradient"
        placeholder={undefined}
        color='red'
        size='sm'
        className='flex items-center text-center w-14'
        onClick={(e) => handleDeleteProcessHint(index)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor"
             className="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
        </svg>
      </Button>
    </div>
  )
}


const ProcessComponent = (props: ITaskProcessProps) => {
  const {taskId, selectNode, savingTrigger} = props

  const [textBookAmount, setTextBookAmount] = useState<number>(0)
  const [textBookDir, setTextBookDir] = useState<string>("")

  const [carouselImgList, setCarouselImgList] = useState<Array<string>>([])

  // process hint
  const [processHintList, setProcessHintList] = useState<Array<ITaskProcessHint>>([])
  // 新增陣列內容
  const handleAddNewProcessHint = () => {
    setProcessHintList(prevState => {
      return [...prevState, {title: '', description: ''}]
    })
  }
  // 修改陣列內容
  const handleEditProcessHint = (index: number, key: 'title' | 'description', value: string) => {
    setProcessHintList(prevState => {
      const updateList = [...prevState]
      updateList[index] = {
        ...updateList[index],
        [key]: value,
      }
      return updateList
    })
  }
  // 刪除陣列內容
  const handleDeleteProcessHint = (index: number) => {
    setProcessHintList(prevState => prevState.filter((_, i) => i !== index))
  }

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
        setTextBookAmount(parseInt(response.data.file_amount))
        setTextBookDir(response.data.file_dir)
      })
    }
  }

  useEffect(() => {
    const fetchTextBookFiles = () => {
      API_getTextBookFile(taskId).then(response => {
        const fileLocation = response.data.file_dir[selectNode.key]
        const fileAmount = response.data.file_amount[selectNode.key]
        if (fileLocation) setTextBookDir(fileLocation)
        if (fileAmount) setTextBookAmount(parseInt(fileAmount))
      })
    }
    // 取得 Process Hint
    const fetchProcessHint = () => {
      API_getProcessHint(taskId).then(response => {
        const processHint = response.data.process_hint_list[selectNode.key]
        if (processHint) setProcessHintList(processHint)
      })
    }
    fetchTextBookFiles()
    fetchProcessHint()
  }, []);

  useEffect(() => {
    const uploadProcessHint = () => {
      setAlertOpen(true)
      setAlertContent("🟠更新中...")
      API_uploadProcessHint(taskId || '', selectNode.key, processHintList).then(response => {
        setAlertContent(`🟢更新成功:${response.message}`)
      })
    }
    if (savingTrigger > 0) uploadProcessHint()
  }, [savingTrigger])

  useEffect(() => {
    const newCarouselImgList = Array.from({length: textBookAmount}).map(
      (_, i) => `${textBookDir}/page_${i + 1}.jpg?ts=${Date.now()}`
    )
    setCarouselImgList(newCarouselImgList)
  }, [textBookAmount]);

  return (
    <div className='h-[70vh] overflow-auto'>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <FileUploadComponent handleUploadFile={handleUploadFile} fileInputRef={fileInputRef} setAlertOpen={setAlertOpen}
                           type={'PDF2images'} setAlertContent={setAlertContent} setFileData={undefined}/>
      <div className='max-h-[70vh] overflow-scroll'>
        <CarouselComponent carouselImgList={carouselImgList}/>
      </div>
      <hr/>
      <div className='flex flex-col gap-y-4 mt-4'>
        <Typography variant="h3" placeholder={undefined}>設定實作提示</Typography>
        {processHintList.map(({title, description}, index) => (
          <ProcessHintComponent key={index} index={index} title={title} description={description}
                                handleEditProcessHint={handleEditProcessHint}
                                handleDeleteProcessHint={handleDeleteProcessHint}/>)
        )}
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleAddNewProcessHint}
          className='min-h-11'
        >
          新增子任務
        </Button>
      </div>
    </div>
  )
}

export default ProcessComponent