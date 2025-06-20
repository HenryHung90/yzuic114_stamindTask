import {useState, useEffect} from "react";
// style

// API
import {
  calculateCompletedNumbers,
  calculateSelfScoringData,
  calculateSubTargetCompleted,
} from "../../../../../../utils/functions/admin/home/components/taskInfo";
import {API_getStudentTasksByTaskId} from "../../../../../../utils/API/API_StudentTasks";
import {API_getTaskTarget} from "../../../../../../utils/API/API_Targets";
import {API_getChatAIHeatMapDataByTaskId} from "../../../../../../utils/API/API_ChatHistories";
import {API_getStudentRecordsInfoByTaskId} from "../../../../../../utils/API/API_StudentRecords";

// components
import PieChartComponent, {IPieChartProps} from "../../../../../../components/Chart/PieChart";
import BoxPlotChartComponent, {IBoxPlotChartProps} from "../../../../../../components/Chart/BoxPlotChart";
import StackedPercentageChartComponent, {
  IStackedPercentageBarChartProps
} from "../../../../../../components/Chart/StackedPercentageChart";
import HeatMapChartComponent, {IHeatMapChartProps} from "../../../../../../components/Chart/HeatMapChart";
import LineChartComponent, {ILineChartProps} from "../../../../../../components/Chart/LineChart";

// interface
import {
  IDataVisualizationProps,
  ISubTargetCompleted,
  ICompleteStatus,
  ISelfScoringData,
  IChatAIHeatMapData,
  IStageDurationData
} from "../../../../../../utils/interface/adminManage";


const TaskDataVisualizationComponent = (props: IDataVisualizationProps) => {
  const {taskId, loading, chartsRef} = props;

  const [studentIdList, setStudentIdList] = useState<Array<string>>([])
  const [studentTaskDataList, setStudentTaskDataList] = useState<Array<Array<{ [key: string]: string }>>>([]);
  const [subTargetList, setSubTargetList] = useState<Array<string>>([])
  const [subTargetCompleted, setSubTargetCompleted] = useState<ISubTargetCompleted>({
    completed: [],
    notCompleted: [],
    unselected: []
  })

  const [completeStatus, setCompleteStatus] = useState<ICompleteStatus>({
    '實驗組-完成': 0,
    '實驗組-未完成': 0,
    '操作組-完成': 0,
    '操作組-未完成': 0
  });
  const [selfScoringData, setSelfScoringData] = useState<ISelfScoringData>({min: 0, q1: 0, median: 0, q3: 0, max: 0})

  const [chatAIHeatMapData, setChatAIHeatMapData] = useState<IChatAIHeatMapData>({
    'day_list': [],
    'ask_times_list': [],
    'student_ask_list': [],
    'student_list': []
  })

  const STAGES = ['體驗任務', '學習目標', '計劃設定', '計劃執行', '自我反思', '總體回饋']
  const [stageDurationData, setStageDurationData] = useState<IStageDurationData>({
    'EXPERIMENTAL': {min: [], q1: [], median: [], means: [], q3: [], max: []},
    'CONTROL': {min: [], q1: [], median: [], means: [], q3: [], max: []}
  })

  useEffect(() => {
    if (!taskId) return;
    loading.setLoadingOpen(true);

    Promise.all([
      // 獲取學生任務數據
      API_getStudentTasksByTaskId(taskId)
        .then(response => {
          setStudentIdList(response.data.student_id_list);
          setStudentTaskDataList(response.data.student_data_list);
          return response;
        }),
      // 獲取任務目標
      API_getTaskTarget(taskId)
        .then(response => {
          const subTargetList = response.data.sub_target_list[0].map(
            (item: { title: string }) => item.title
          );
          setSubTargetList(subTargetList);
          return response;
        }),
      // 獲取熱力圖數據
      API_getChatAIHeatMapDataByTaskId(taskId)
        .then(response => {
          setChatAIHeatMapData(response.data)
          return response;
        }),
      API_getStudentRecordsInfoByTaskId(taskId)
        .then(response => {
          console.log(response.data.record_data)
          setStageDurationData(response.data.record_data)
          return response
        })
    ])
      .then(() => {
        // 所有請求完成後關閉加載狀態
        loading.setLoadingOpen(false);
      })
      .catch(error => {
        // 錯誤處理
        console.error("獲取數據時發生錯誤:", error);
        loading.setLoadingOpen(false);
      });
  }, [])
  useEffect(() => {
    const calculateData = () => {
      // 更新完成人數
      setCompleteStatus(calculateCompletedNumbers(studentTaskDataList))
      // 更新箱型圖圖資
      setSelfScoringData(calculateSelfScoringData(studentTaskDataList))
      // 更新子任務完成狀態
      setSubTargetCompleted(calculateSubTargetCompleted(studentTaskDataList, subTargetList.length))
    }
    calculateData()
  }, [studentIdList, studentTaskDataList, subTargetList]);

  // 任務完成度 PieChart Data
  const pieChartData: IPieChartProps = {
    title: `任務完成狀態(總人數：${studentIdList.length}人)`,
    labels: [...Object.keys(completeStatus)],
    datasets: [
      {
        data: [...Object.values(completeStatus)],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75,98,192,0.6)', 'rgba(253,44,44,0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgb(75,102,192)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  }
  // 學生自我評分 BoxPlotChart Data
  const StudentScoringBoxPlotData: IBoxPlotChartProps = {
    title: '學生自我評分分佈',
    labels: ['評分'],
    datasets: [
      {
        label: '自我評分',
        min: [selfScoringData.min],
        q1: [selfScoringData.q1],
        median: [selfScoringData.median],
        q3: [selfScoringData.q3],
        max: [selfScoringData.max],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  }
  // 子任務完成度 StackedPercentageChart Data
  const taskData: IStackedPercentageBarChartProps = {
    title: '子任務完成率',
    labels: [...subTargetList],
    datasets: [
      {
        label: '已完成',
        data: [...subTargetCompleted.completed],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '未完成',
        data: [...subTargetCompleted.notCompleted],
        backgroundColor: 'rgba(227,101,16,0.8)',
        borderColor: 'rgb(239,108,1)',
        borderWidth: 1,
      },
      {
        label: '未選取',
        data: [...subTargetCompleted.unselected],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
    horizontal: true
  }
  // AI 詢問 HeatMap Data
  const heatMapData: IHeatMapChartProps = {
    title: '詢問 GPT 熱力圖',
    label: '詢問 GPT 熱力圖次數（顏色越深表越多）',
    data: chatAIHeatMapData.student_ask_list,
    timeLabels: chatAIHeatMapData.day_list,
    studentLabels: chatAIHeatMapData.student_list
  }
  // AI 詢問次數 LineChart Data
  const GPTLineData: ILineChartProps = {
    title: '詢問次數時間軸',
    labels: chatAIHeatMapData.day_list,
    datasets: [
      {
        label: 'Amum Amum',
        data: chatAIHeatMapData.ask_times_list,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
    yAxisOptions: {
      min: 0,
      title: '詢問次數'
    }
  }
  // 各階段持續時間 BoxPlot Data
  const stageDurationBoxPlotData: IBoxPlotChartProps = {
    title: '各階段駐留時間',
    labels: STAGES,
    datasets: [
      {
        label: '實驗組',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        min: stageDurationData.EXPERIMENTAL.min,     // 每個值對應一個標籤
        q1: stageDurationData.EXPERIMENTAL.q1,
        median: stageDurationData.EXPERIMENTAL.median,
        q3: stageDurationData.EXPERIMENTAL.q3,
        max: stageDurationData.EXPERIMENTAL.max
      },
      {
        label: '控制組',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        min: stageDurationData.CONTROL.min,
        q1: stageDurationData.CONTROL.q1,
        median: stageDurationData.CONTROL.median,
        q3: stageDurationData.CONTROL.q3,
        max: stageDurationData.CONTROL.max
      }
    ],
    yAxisOptions: {
      beginAtZero: true,
      stepSize: 10,
      title: '分鐘'
    }
  }
  // 各階段平均駐留時間 LineChart Data
  const stageDurationMeansLineData: ILineChartProps = {
    title: '各階段平均駐留時間',
    labels: STAGES,
    datasets: [
      {
        label: '實驗組',
        data: stageDurationData.EXPERIMENTAL.means,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '對照組',
        data: stageDurationData.CONTROL.means,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
    yAxisOptions: {
      min: 0,
      title: '分鐘'
    }
  }

  return (
    <div ref={chartsRef} className='flex flex-col gap-y-4 p-4 h-[90%] w-full overflow-scroll'>
      <div className='flex justify-center items-center gap-x-8'>
        <div className='w-96 h-[20rem]'>
          <PieChartComponent {...pieChartData}/>
        </div>
        <div className='w-48 h-[20rem]'>
          <BoxPlotChartComponent {...StudentScoringBoxPlotData}/>
        </div>
        <div className='w-96 h-[20rem]'>
          <StackedPercentageChartComponent {...taskData}/>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center gap-y-4'>
        <div className='w-full' style={{height: `${chatAIHeatMapData.student_list.length * 1.2 + 15}rem`}}>
          <HeatMapChartComponent {...heatMapData}/>
        </div>
        <div className='w-full h-[12rem]'>
          <LineChartComponent {...GPTLineData}/>
        </div>
        <div className='w-full h-[12rem]'>
          <BoxPlotChartComponent {...stageDurationBoxPlotData}/>
        </div>
        <div className='w-[90%] h-[12rem]'>
          <LineChartComponent {...stageDurationMeansLineData}/>
        </div>
      </div>
    </div>
  )
}

export default TaskDataVisualizationComponent