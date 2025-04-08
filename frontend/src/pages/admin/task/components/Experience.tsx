import {useEffect, useState, useRef} from "react";
// style
import {Button} from "@material-tailwind/react"

// API
import {API_getTaskExperience, API_uploadTaskExperienceFile} from "../../../../utils/API/API_Experiences"

// components
import AlertMsg from "../../../../components/Alert/Alert"
import FileUploadComponent from "../../../../components/FileUpload/FileUpload";

// interface
import {ITaskExperienceProps} from "../../../../utils/interface/Task";

const ExperiencePageComponent = (props: ITaskExperienceProps) => {
  const {taskId, selectNode, settingAlertLogAndLoading} = props

  const [experienceData, setExperienceData] = useState<string>("")

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
      API_uploadTaskExperienceFile(taskId || '', file, selectNode.key).then(response => {
        setAlertContent(`🟢上傳成功, 檔案名稱：${response.data.file_name}`)
      })
    }
  }


  useEffect(() => {
    const fetchTaskExperience = async () => {
      API_getTaskExperience(taskId).then(response => {
        const fileLocation = response.data.experience_info.experience_files[selectNode.key]
        if (fileLocation) {
          setExperienceData(`/${import.meta.env.VITE_APP_FILE_ROUTE}/experience_files/${fileLocation}`)
        } else {
          setExperienceData("")
        }
      })
    }
    fetchTaskExperience()
  }, []);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <FileUploadComponent handleUploadFile={handleUploadFile} fileInputRef={fileInputRef} setAlertOpen={setAlertOpen}
                           type={"HTML"} setAlertContent={setAlertContent} setFileData={setExperienceData}/>
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