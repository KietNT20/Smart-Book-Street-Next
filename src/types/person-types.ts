export interface DailyVisitorsStatistics {
  data: {
    date: string;
    gender: 'male' | 'female';
    count: number;
  }[];
}

export interface DailyStatisticsRecord {
  male: number;
  female: number;
  total: number;
}

export interface DatasetInfo {
  label: string;
  data: number[];
}

export interface DailyVisitorsResponse {
  success: boolean;
  startDate: string;
  endDate: string;
  statistics: {
    [date: string]: DailyStatisticsRecord;
  };
  chartData: {
    labels: string[];
    datasets: DatasetInfo[];
  };
}

export interface BarData {
  success: boolean;
  barData: BarDatum[];
}

export interface BarDatum {
  day: Date | string;
  visitor: number;
  male: number;
  female: number;
}

export enum Trend {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  STABLE = 'unchanged',
}

export interface PersonTotal {
  success: boolean;
  total: number;
  currentMonthPercentChange: number;
  changeDirection: Trend;
}

export interface AverageMinute {
  success: boolean;
  averageTime: string;
  averageTimeByGender: AverageTimeByGender;
  chartData: ChartDatum[];
  averageTimeMinutes: number;
}

export interface AverageTimeByGender {
  male: string;
  female: string;
}

export interface ChartDatum {
  label: string;
  value: number;
  time: string;
}

export interface PersonChartDateHours {
  hour: string;
  male: number;
  female: number;
  total: number;
}

export interface StatisticPersonAvgTime {
  success: boolean;
  averageTime: string;
  averageTimeByGender: AverageTimeByGender;
  chartData: ChartDatum[];
  averageTimeMinutes: number;
}

export interface AverageTimeByGender {
  male: string;
  female: string;
}

export interface ChartDatum {
  label: string;
  value: number;
  time: string;
}
