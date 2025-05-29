import {Line} from 'react-chartjs-2';
import {ChartData} from 'chart.js';
// style

// API

// components

// interface
export interface ILineChartProps {
  // 圖表標題
  title: string;
  // X 軸的標籤，可以是字串或數字
  labels: Array<string | number>;
  // 數據集，每個數據集包含標籤和數據
  datasets: Array<{
    label: string; // 數據集的名稱
    data: Array<number>; // 數據集的數據，應該是數字類型
    backgroundColor?: string; // 可選，點的背景顏色
    borderColor?: string; // 可選，線條顏色
    borderWidth?: number; // 可選，線條寬度
    pointBackgroundColor?: string | string[]; // 可選，點的背景顏色
    pointBorderColor?: string | string[]; // 可選，點的邊框顏色
    pointRadius?: number; // 可選，點的半徑
    tension?: number; // 可選，線條曲率 (0 為直線，1 為最大曲率)
    fill?: boolean; // 可選，是否填充線條下方區域
  }>;
  // 可選的 Y 軸設置
  yAxisOptions?: {
    min?: number; // Y 軸最小值
    max?: number; // Y 軸最大值
    stepSize?: number; // Y 軸刻度間隔
    title?: string; // Y 軸標題
  };
}


const LineChartComponent = (props: ILineChartProps) => {
  const {title, labels, datasets, yAxisOptions} = props;

  const data: ChartData<'line'> = {
    labels: labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      tension: dataset.tension ?? 0.2, // 默認添加一些曲率
      pointRadius: dataset.pointRadius ?? 3, // 默認點大小
      fill: dataset.fill ?? false // 默認不填充
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 允許圖表大小根據父容器調整
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        min: yAxisOptions?.min,
        max: yAxisOptions?.max,
        ticks: {
          stepSize: yAxisOptions?.stepSize
        },
        title: {
          display: !!yAxisOptions?.title,
          text: yAxisOptions?.title
        }
      },
      x: {
        title: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  }

  return <Line data={data} options={options}/>
}

export default LineChartComponent