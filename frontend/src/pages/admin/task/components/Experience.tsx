import {useEffect, useState} from "react";
import {ISettingAlertLogAndLoading} from "../../../../utils/interface/alertLog";
import {API_getTaskExperience} from "../../../../utils/API/API_Experiences";
// style

// API

// components

// interface
interface IExperiencePageProps {
  taskId: string | undefined
  selectNode: { key: number, category: string, text: string }
  iframeKey: number
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}


const ExperiencePageComponent = (props: IExperiencePageProps) => {
  const {taskId, selectNode, iframeKey, settingAlertLogAndLoading} = props

  const [experienceData, setExperienceData] = useState<String>()

  useEffect(() => {
    const fetchTaskExperience = async () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskExperience(taskId).then(response => {
        settingAlertLogAndLoading.setLoadingOpen(false)
        setExperienceData(response.data.experience_info.experience_file[selectNode.key])
      })
    }
    fetchTaskExperience()
  }, []);

  return (
    <div>
      {experienceData ? (
        <iframe
          key={iframeKey}
          src={`/files/experience_files/${experienceData}`} // 動態設置 iframe 的 src
          title="Experience File"
          style={{
            width: "100%",
            height: "600px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        ></iframe>
      ) : (
        <p>Loading experience file...</p>
      )}
    </div>
  )
}

export default ExperiencePageComponent