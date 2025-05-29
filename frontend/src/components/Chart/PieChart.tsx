import {Pie} from 'react-chartjs-2';
import {ChartData, ChartOptions} from "chart.js";
// style

// API

// components

// interface
export interface IPieChartProps {
  title: string;
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }>;
}

const PieChartComponent = (props: IPieChartProps) => {
  const {title, labels, datasets} = props;

  const data: ChartData<'pie'> = {
    labels: labels,
    datasets: datasets
  }

  const options: ChartOptions<'pie'> = {
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
    },
  };

  return <Pie data={data} options={options}/>;
}

export default PieChartComponent;