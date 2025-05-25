import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Province {
  name: string;
  code: number;
  division_type: string;
  phone_code: number;
  codename: string;
  districts?: District[];
}

export interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  wards?: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  district_code: number;
}

const PROVINCES_API_BASE = process.env.NEXT_PUBLIC_PROVINCES_API as string;

const provincesService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await axios.get(`${PROVINCES_API_BASE}/p/`);
    return response.data;
  },

  getProvinceWithDistricts: async (provinceCode: number): Promise<Province> => {
    const response = await axios.get(
      `${PROVINCES_API_BASE}/p/${provinceCode}`,
      {
        params: { depth: 2 },
      }
    );
    return response.data;
  },

  getDistrictWithWards: async (districtCode: number): Promise<District> => {
    const response = await axios.get(
      `${PROVINCES_API_BASE}/d/${districtCode}`,
      {
        params: { depth: 2 },
      }
    );
    return response.data;
  },

  searchProvinces: async (query: string): Promise<Province[]> => {
    const response = await axios.get(`${PROVINCES_API_BASE}/p/search/`, {
      params: { q: query },
    });
    return response.data;
  },
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: provincesService.getProvinces,
  });
};

export const useDistricts = (provinceCode: number | null) => {
  return useQuery({
    queryKey: ['districts', provinceCode],
    queryFn: () => provincesService.getProvinceWithDistricts(provinceCode!),
    enabled: !!provinceCode,
    select: (data) => data.districts || [],
  });
};

export const useWards = (districtCode: number | null) => {
  return useQuery({
    queryKey: ['wards', districtCode],
    queryFn: () => provincesService.getDistrictWithWards(districtCode!),
    enabled: !!districtCode,
    select: (data) => data.wards || [],
  });
};

export const useSearchProvinces = (query: string) => {
  return useQuery({
    queryKey: ['provinces-search', query],
    queryFn: () => provincesService.searchProvinces(query),
    enabled: query.length >= 2,
  });
};
