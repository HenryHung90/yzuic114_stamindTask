import {Chart} from 'react-chartjs-2'
// style

// API

// components

// interface
interface MatrixDataPoint {
  x: string;  // 時間點
  y: string;  // 學生名稱
  v: number;  // 詢問次數
}

// 定義組件 props
export interface IHeatMapChartProps {
  title: string;
  label: string;
  data: MatrixDataPoint[];
  timeLabels: string[];  // 所有時間點
  studentLabels: string[];  // 所有學生名稱
}

const HeatMapChartComponent = (props: IHeatMapChartProps) => {
  const {title, label, data, timeLabels, studentLabels} = props;
  // 找出數據中的最大值，用於顏色比例尺
  const maxValue = Math.max(...data.map(d => d.v));

  // GitHub 風格的顏色 - 從淺到深的綠色
  const getColor = (value: number) => {
    if (value === 0) return '#ebedf0';  // 無活動的顏色
    const intensity = Math.ceil((value / maxValue) * 4);  // 0-4 的強度級別

    switch (intensity) {
      case 1:
        return '#9be9a8';  // 最淺的綠色
      case 2:
        return '#40c463';  // 中淺綠色
      case 3:
        return '#30a14e';  // 中深綠色
      case 4:
        return '#216e39';  // 最深的綠色
      default:
        return '#ebedf0';  // 默認顏色
    }
  };

  // 計算建議的方塊大小
  const calculateBlockSize = () => {
    // 根據數據量動態調整方塊大小
    const timeCount = timeLabels.length;
    const studentCount = studentLabels.length;

    // 基於容器大小和數據量計算合適的方Ｆ塊大小
    // 這裡假設容器寬度為800px，高度為500px
    const suggestedWidth = Math.min(50, Math.max(10, Math.floor(800 / timeCount)));
    const suggestedHeight = Math.min(25, Math.max(10, Math.floor(500 / studentCount)));

    return {width: suggestedWidth, height: suggestedHeight};
  };

  const {width: blockWidth, height: blockHeight} = calculateBlockSize();

  const chartData = {
    title: title,
    datasets: [{
      label: label,
      data: data,
      backgroundColor(context: any) {
        if (!context.dataset.data) return '#ebedf0';

        const dataPoint = context.dataset.data[context.dataIndex] as MatrixDataPoint;
        if (!dataPoint) return '#ebedf0';

        return getColor(dataPoint.v);
      },
      borderColor: '#ffffff',
      borderWidth: 2,
      borderRadius: 2,  // 添加圓角
      // 固定大小的小方塊
      width: blockWidth,  // 固定寬度為15px
      height: blockHeight  // 固定高度為15px
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category' as const,
        labels: timeLabels,
        position: 'top' as const,
        title: {
          display: true,
          text: '時間點'
        }
      },
      y: {
        type: 'category' as const,
        labels: studentLabels,
        title: {
          display: true,
          text: '學生'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: () => '',
          label: (context: any) => {
            const dataPoint = context.dataset.data[context.dataIndex] as MatrixDataPoint;
            return [
              `學生: ${dataPoint.y}`,
              `時間: ${dataPoint.x}`,
              `詢問次數: ${dataPoint.v}`
            ];
          }
        }
      }
    }
  };

  return <Chart type='matrix' data={chartData} options={options}/>
}

export default HeatMapChartComponent