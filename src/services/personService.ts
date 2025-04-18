import { API_ENDPOINT } from '@/enums/endpoint';
import { DailyPopulationStatistics } from '@/lib/zod';
import {
  AverageMinute,
  BarData,
  DailyVisitorsResponse,
  PersonTotal,
} from '@/types/person-types';
import axiosInstance from '@/utils/axiosInstance';

enum GenderCount {
  MALE = 'male',
  FEMALE = 'female',
}

export const personService = {
  syncData: async (): Promise<{ isSuccess: boolean; message: string }> => {
    const res = await axiosInstance.post(`${API_ENDPOINT.PERSON}/sync`);
    return res.data;
  },
  total: async (): Promise<PersonTotal> => {
    const res = await axiosInstance.get(`${API_ENDPOINT.PERSON}/stats/total`);
    return res.data;
  },
  getTotalByGender: async (
    gender: GenderCount
  ): Promise<{
    success: boolean;
    gender: GenderCount;
    count: number;
  }> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/gender/${gender}`
    );
    return res.data;
  },
  dailyPopulation: async (
    query: DailyPopulationStatistics
  ): Promise<{
    success: boolean;
    date: string;
    statistics: {
      male: number;
      female: number;
      total: number;
    };
  }> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/daily${query}`
    );
    return res.data;
  },
  monthlyPopulation: async (
    yearly: number,
    month: number
  ): Promise<{
    success: boolean;
    year: number;
    month: number;
    statistics: {
      male: number;
      female: number;
      total: number;
    };
  }> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/monthly/${yearly}/${month}`
    );
    return res.data;
  },
  dailyVisitors: async (query: {
    startDate: string;
    endDate: string;
  }): Promise<DailyVisitorsResponse> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/range-gender?startDate=${query.startDate}&endDate=${query.endDate}`
    );
    return res.data;
  },
  dailyRange: async (query: {
    startDate: string;
    endDate: string;
  }): Promise<BarData> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/range?startDate=${query.startDate}&endDate=${query.endDate}`
    );
    return res.data;
  },
  getAverageMinute: async (): Promise<AverageMinute> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.PERSON}/stats/average-time`
    );
    return res.data;
  },
};
