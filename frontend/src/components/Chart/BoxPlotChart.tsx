import {Chart} from 'react-chartjs-2';
// style

// API

// components

// interface
export interface IBoxPlotChartProps {
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    min: number[];
    q1: number[];
    median: number[];
    q3: number[];
    max: number[];
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number;
    medianColor?: string;
    medianWidth?: number;
  }>
  yAxisOptions?: {
    beginAtZero?: boolean;
    min?: number; // Y 軸最小值
    max?: number; // Y 軸最大值
    stepSize?: number; // Y 軸刻度間隔
    title?: string; // Y 軸標題
  };
}

const BoxPlotChartComponent = (props: IBoxPlotChartProps) => {
  const {title, labels, datasets, yAxisOptions} = props;

  // 轉換數據格式以適應 Chart.js boxplot
  const chartDatasets = datasets.map(dataset => {
    return {
      label: dataset.label,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor || 'rgba(0, 0, 0, 1)',
      borderWidth: dataset.borderWidth || 1,
      medianColor: dataset.medianColor || 'rgb(49,49,252)',
      medianWidth: dataset.medianWidth || 5,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 2,
      width: 10,
      data: labels.map((_, index) => {
        return {
          min: dataset.min[index],
          q1: dataset.q1[index],
          median: dataset.median[index],
          q3: dataset.q3[index],
          max: dataset.max[index],
        };
      })
    };
  });
  const data = {
    labels: labels,
    datasets: chartDatasets,
  };

  const options = {
    minStats: 'q1' as const,
    maxStats: 'q3' as const,
    responsive: true,
    maintainAspectRatio: false, // 允許圖表大小根據父容器調整
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetIndex = context.datasetIndex;
            const index = context.dataIndex;
            const boxPlotData = context.chart.data.datasets[datasetIndex].data[index];

            return [
              `${context.chart.data.datasets[datasetIndex].label}:`,
              `最小值: ${boxPlotData.min}`,
              `第一四分位數: ${boxPlotData.q1}`,
              `中位數: ${boxPlotData.median}`,
              `第三四分位數: ${boxPlotData.q3}`,
              `最大值: ${boxPlotData.max}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: yAxisOptions?.beginAtZero ?? true,
        stepSize: yAxisOptions?.stepSize,
        max: yAxisOptions?.max,
        title: {
          display: !!yAxisOptions?.title,
          text: yAxisOptions?.title
        },
      },
    },
  };

  return <Chart type='boxplot' data={data} options={options}/>
}

export default BoxPlotChartComponent