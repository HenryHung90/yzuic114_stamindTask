import {useEffect, useState} from "react";
// style

// API
import {API_getTaskExperience} from "../../../utils/API/API_Experiences";

// components

// interface
import {ITaskExperienceProps} from "../../../utils/interface/Task";


const ExperiencePageComponent = (props: ITaskExperienceProps) => {
  const {taskId, selectNode, iframeKey, settingAlertLogAndLoading} = props

  const [experienceData, setExperienceData] = useState<string>()

  useEffect(() => {
    const fetchTaskExperience = () => {
      settingAlertLogAndLoading.setLoadingOpen(true)
      API_getTaskExperience(taskId).then(response => {
        settingAlertLogAndLoading.setLoadingOpen(false)
        setExperienceData(response.data.html_content)
      })
    }
    fetchTaskExperience()
  }, []);

  return (
    <div>
      {experienceData ? (
        <iframe
          key={iframeKey}
          sandbox="allow-scripts allow-modals"
          srcDoc={experienceData}
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
