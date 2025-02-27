import {useEffect, useState, useRef} from "react";
// style
import {Button} from "@material-tailwind/react"

// API
import {API_getTaskExperience, API_uploadTaskExperienceFile} from "../../../../utils/API/API_Experiences"

// components
import AlertMsg from "../../../../components/Alert/Alert"

// interface
interface IExperiencePageProps {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {ISettingAlertLogAndLoading} from "../../../../utils/interface/alertLog";

const ExperiencePageComponent = (props: IExperiencePageProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props

  const [experienceData, setExperienceData] = useState<string>("")
  const [fileName, setFileName] = useState<string>("")

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  // 參考 input 元素
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理按下按鈕時的事件
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 觸發 input 的點擊事件
    }
  };

  // 處理檔案選擇事件
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // 檔案限制大小 1 MB
      if (files[0].size > 1024 * 1024) {
        setAlertOpen(true)
        setAlertContent("🚫檔案大小不得超過 1 MB")
        if (fileInputRef.current) fileInputRef.current.value = ""; // 清空 input 的值
      } else {
        setFileName(files[0].name)
        // 本地預覽
        const fileURL = URL.createObjectURL(files[0])
        setExperienceData(fileURL)
      }
    }
  };

  // Upload file
  const handleUploadFile = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0]
      setAlertOpen(true)
      setAlertContent("🟠上傳中...")
      API_uploadTaskExperienceFile(taskId || '', file, selectNode.key).then(response => {
        setAlertContent(`🟢上傳成功, 檔案名稱：${response.data.file_name}`)
      })
    }
  }


  useEffect(() => {
    const fetchTaskExperience = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskExperience(taskId).then(response => {
        settingAlertLogAndLoading.setLoadingOpen(false)
        const fileLocation = response.data.experience_info.experience_files[selectNode.key]
        if (fileLocation) {
          setExperienceData(`/files/experience_files/${fileLocation}`)
        }else{
          setExperienceData("")
        }
      })
    }
    fetchTaskExperience()
  }, []);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='flex gap-x-2'>
        <Button variant="gradient" placeholder={undefined} onClick={handleButtonClick}>上傳檔案</Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{display: "none"}}
          accept=".html" // 限制只能選擇 .html 檔案
          onChange={handleFileChange}
        />
        <p className='flex justify-center items-center'>{fileName}</p>
        <Button
          variant="gradient"
          placeholder={undefined}
          onClick={handleUploadFile}
        >
          確認上傳
        </Button>
      </div>
      <div>
        {experienceData ? (
          <iframe
            src={experienceData} // 動態設置 iframe 的 src
            title="Experience File"
            style={{
              width: "100%",
              height: "600px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          ></iframe>
        ) : (
          <p>目前無上傳檔案</p>
        )}
      </div>
    </div>
  )
}

export default ExperiencePageComponent