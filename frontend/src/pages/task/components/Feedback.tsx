import React, {useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css'; // 引入 Highlight.js 的樣式
// style
// API
import {API_generateTeacherFeedback, API_getTeacherFeedback} from "../../../utils/API/API_Feedback";
import {API_getStudentTaskReflections} from "../../../utils/API/API_StudentTaskReflections";

// components
import AlertMsg from "../../../components/Alert/Alert";

// interface
import {ITaskFeedbackProps} from "../../../utils/interface/Task";
import {EGroupType} from "../../../utils/functions/common";

const FeedbackComponent = (props: ITaskFeedbackProps) => {
  const {taskId, groupType, selectNode} = props

  const [feedbackContent, setFeedbackContent] = useState<string>('');

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  useEffect(() => {
    const fetchTeacherFeedback = () => {
      setAlertOpen(true)
      setAlertContent('🟠確認您的進度中...')
      API_getStudentTaskReflections(taskId || '').then(async response => {
        if (groupType === EGroupType.EXPERIMENTAL) {
          if (!response.data.reflect_list) setFeedbackContent("🟠尚未完成本階段")
          const reflectionData = response.data.reflect_list[selectNode.key]
          const isNotComplete = reflectionData.some((reflect: { reflect: string }) => reflect.reflect == '')

          if (isNotComplete) setFeedbackContent("🟠尚未完成本階段")
        }

        await API_getTeacherFeedback(taskId || '', selectNode.key).then(response => {
          if (response.data.feedback === 'empty') {
            if (groupType === EGroupType.CONTROL) {
              const sureToSubmit = window.confirm("你確定要生成總結嗎？只有一次機會喔！")
              if (!sureToSubmit) return setFeedbackContent("🟠尚未完成本階段")
            }
            setFeedbackContent('')
            setAlertContent('🟠生成中...')
            API_generateTeacherFeedback(taskId || '', selectNode.key).then(response => {
              setFeedbackContent(response.data.feedback)
              setAlertContent('🟢生成完成')
            })
          } else {
            setFeedbackContent(response.data.feedback)
            setAlertContent('🟢取得回饋成功')
          }
        })
      })

    }
    fetchTeacherFeedback()
  }, []);

  return (
    <div>
      <AlertMsg content={alertContent} open={alertOpen} setOpen={setAlertOpen}/>
      <div className='h-[60vh] overflow-auto'>
        <div className="prose prose-slate max-w-none">
          {/*@ts-ignore*/}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            children={feedbackContent ? feedbackContent : '正在對該階段進行總結，請稍候...'}
          />
        </div>
      </div>
    </div>
  )
}

export default FeedbackComponent