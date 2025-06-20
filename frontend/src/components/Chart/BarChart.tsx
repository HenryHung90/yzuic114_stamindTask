import {Bar} from 'react-chartjs-2';
import {ChartData} from 'chart.js';
// style

// API

// components

// interface
export interface IBarChartProps {
  // 圖表標題
  title: string;
  // X 軸的標籤，可以是字串或數字
  labels: Array<string | number>;
  // 數據集，每個數據集包含標籤和數據
  datasets: Array<{
    label: string; // 數據集的名稱
    data: Array<number>; // 數據集的數據，應該是數字類型
    backgroundColor?: string | string[]; // 可選，背景顏色（單一顏色或多顏色）
    borderColor?: string | string[]; // 可選，邊框顏色
    borderWidth?: number; // 可選，邊框寬度
  }>;
}

const BarChartComponent = (props: IBarChartProps) => {
  const {title, labels, datasets} = props;

  const data: ChartData<'bar'> = {
    labels: labels,
    datasets: datasets
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 允許圖表Ｆ大小根據父容器調整
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Bar data={data} options={options}/>
}

export default BarChartComponent