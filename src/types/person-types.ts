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
