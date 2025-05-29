import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {BoxPlotController, BoxAndWiskers} from '@sgratzl/chartjs-chart-boxplot';
import {MatrixController, MatrixElement} from 'chartjs-chart-matrix';

// 註冊所需的圖表類型和插件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement, // 必須註冊的元素
  BarElement,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers,
  MatrixController,
  MatrixElement
);


