import {Bar} from 'react-chartjs-2';
import {ChartData, ChartOptions} from 'chart.js';
// style

// API

// components

// interface
export interface IStackedPercentageBarChartProps {
  // 圖表標題
  title: string;
  // 任務名稱列表
  labels: string[];
  // 數據集，包含完成和未完成的數據
  datasets: Array<{
    label: string; // 數據集的名稱 (例如 "已完成" 或 "未完成")
    data: number[]; // 原始數據值
    backgroundColor?: string; // 可選，背景顏色
    borderColor?: string; // 可選，邊框顏色
    borderWidth?: number; // 可選，邊框寬度
  }>;
  // 可選，是否水平顯示條形圖
  horizontal?: boolean;
}

const StackedPercentageChartComponent = (props: IStackedPercentageBarChartProps) => {
  const {title, labels, datasets, horizontal = true} = props;


  // 計算每個標籤的總和
  const totals = labels.map((_, index) => {
    return datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
  });

  // 將原始數據轉換為百分比數據
  const percentageDatasets = datasets.map(dataset => {
    return {
      ...dataset,
      data: dataset.data.map((value, index) => {
        // 計算百分比，如果總和為0則返回0
        return totals[index] === 0 ? 0 : (value / totals[index]) * 100;
      })
    };
  });

  const data: ChartData<'bar'> = {
    labels: labels,
    datasets: percentageDatasets
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x', // 設置條形圖方向
    scales: {
      // 主軸設置（水平模式下是x軸，垂直模式下是y軸）
      [horizontal ? 'x' : 'y']: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`
        },
        title: {
          display: true,
          text: '百分比 (%)'
        }
      },
      // 類別軸設置（水平模式下是y軸，垂直模式下是x軸）
      [horizontal ? 'y' : 'x']: {
        stacked: true
      }
    },
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
          label: (context) => {
            const datasetIndex = context.datasetIndex;
            const index = context.dataIndex;
            const label = context.dataset.label || '';

            // 百分比值（四捨五入到小數點後一位）
            const percentValue = Math.round(context.parsed[horizontal ? 'x' : 'y'] * 10) / 10;

            // 原始數據值
            const originalValue = datasets[datasetIndex].data[index];

            // 總數
            const total = totals[index];

            return [
              `${label}:`,
              `數量: ${originalValue}/${total}`,
              `百分比: ${percentValue}%`
            ];
          }
        }
      }
    }
  };

  return <Bar data={data} options={options}/>
}

export default StackedPercentageChartComponent