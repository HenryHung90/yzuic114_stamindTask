import React, {useState, useEffect} from 'react'
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

const FeedbackComponent = (props: ITaskFeedbackProps) => {
  const {taskId, selectNode} = props

  const [feedbackContent, setFeedbackContent] = useState<string>('');

  // alert
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<string>("")

  useEffect(() => {
    const fetchTeacherFeedback = () => {
      setAlertContent('🟠確認您的進度中...')
      API_getStudentTaskReflections(taskId || '').then(response => {
        const reflectionData = response.data.reflect_list[selectNode.key]

        if (reflectionData) {
          const isNotComplete = reflectionData.some((reflect: { reflect: string }) => reflect.reflect == '')
          if (!isNotComplete) {
            API_getTeacherFeedback(taskId || '', selectNode.key).then(response => {
              if (response.data.feedback === 'empty') {
                API_generateTeacherFeedback(taskId || '', selectNode.key).then(response => {
                  setFeedbackContent(response.data.feedback)
                  setAlertContent('🟢生成完成')
                })
              } else {
                setFeedbackContent(response.data.feedback)
                setAlertContent('🟢取得回饋成功')
              }
            })
          } else {
            setFeedbackContent('你尚未完成本階段')
            setAlertContent('🟢取得回饋成功')
          }
        }

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