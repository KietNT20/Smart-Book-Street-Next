import { useGetStatisticEventRegistrations } from '@/hooks/use-event-registrations';
import { useDistricts, useProvinces } from '@/hooks/use-provinces';
import { EventRegistrationStatisticParams } from '@/types/event-registrations-types';
import { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

export type StatisticFilter = 'all' | 'checkedIn' | 'notCheckedIn';

export interface ChartState {
  age: boolean;
  gender: boolean;
  reference: boolean;
  address: boolean;
  attendedBefore: boolean;
}

export const useEventStatistics = (eventId: string) => {
  const [statisticFilter, setStatisticFilter] =
    useState<StatisticFilter>('all');
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    number | null
  >(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<
    number | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openCharts, setOpenCharts] = useState<ChartState>({
    age: false,
    gender: false,
    reference: false,
    address: false,
    attendedBefore: false,
  });

  const { data: provinces, isLoading: provincesLoading } = useProvinces();
  const { data: districts, isLoading: districtsLoading } =
    useDistricts(selectedProvinceCode);

  const getHookParams = (): EventRegistrationStatisticParams | undefined => {
    const params: EventRegistrationStatisticParams = {};

    switch (statisticFilter) {
      case 'checkedIn':
        params.isAttended = true;
        break;
      case 'notCheckedIn':
        params.isAttended = false;
        break;
      default:
        params.isAttended = undefined;
        break;
    }

    if (selectedProvinceCode) {
      const selectedProvince = provinces?.find(
        (p) => p.code === selectedProvinceCode
      );
      if (selectedProvince) {
        params.province = selectedProvince.name;
      }
    }

    if (selectedDistrictCode) {
      const selectedDistrict = districts?.find(
        (d) => d.code === selectedDistrictCode
      );
      if (selectedDistrict) {
        params.district = selectedDistrict.name;
      }
    }

    if (selectedDate) {
      params.date = selectedDate.format('YYYY-MM-DD');
    }

    const hasFilters =
      params.isAttended !== undefined ||
      params.province ||
      params.district ||
      params.date;
    return hasFilters ? params : undefined;
  };

  const { statisticData } = useGetStatisticEventRegistrations(
    eventId,
    getHookParams()
  );

  // Computed values
  const selectedProvinceName = useMemo(() => {
    return provinces?.find((p) => p.code === selectedProvinceCode)?.name || '';
  }, [provinces, selectedProvinceCode]);

  const selectedDistrictName = useMemo(() => {
    return districts?.find((d) => d.code === selectedDistrictCode)?.name || '';
  }, [districts, selectedDistrictCode]);

  const hasAgeChart =
    statisticData?.ageChart && statisticData.ageChart.length > 0;
  const hasGenderChart =
    statisticData?.genderChart && statisticData.genderChart.length > 0;
  const hasReferenceChart =
    statisticData?.referenceChart && statisticData.referenceChart.length > 0;
  const hasAddressChart =
    statisticData?.addressChart && statisticData.addressChart.length > 0;
  const hasAttendedBeforeChart =
    statisticData?.attendedBeforeChart &&
    statisticData.attendedBeforeChart.length > 0;

  const hasAnyChart =
    hasAgeChart ||
    hasGenderChart ||
    hasReferenceChart ||
    hasAddressChart ||
    hasAttendedBeforeChart;

  // Actions
  const toggleChart = (chart: keyof ChartState) => {
    setOpenCharts((prev) => ({
      ...prev,
      [chart]: !prev[chart],
    }));
  };

  const clearFilters = () => {
    setSelectedProvinceCode(null);
    setSelectedDistrictCode(null);
    setSelectedDate(null);
    setStatisticFilter('all');
  };

  const handleProvinceChange = (value: string) => {
    const provinceCode = value && value !== 'all' ? parseInt(value) : null;
    setSelectedProvinceCode(provinceCode);
    setSelectedDistrictCode(null);
  };

  const handleDistrictChange = (value: string) => {
    const districtCode = value && value !== 'all' ? parseInt(value) : null;
    setSelectedDistrictCode(districtCode);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (statisticFilter !== 'all') count++;
    if (selectedProvinceCode) count++;
    if (selectedDistrictCode) count++;
    if (selectedDate) count++;
    return count;
  };

  const getFilterDescription = () => {
    const filters = [];
    if (selectedProvinceName) filters.push(selectedProvinceName);
    if (selectedDistrictName) filters.push(selectedDistrictName);
    if (selectedDate)
      filters.push(`Ngày: ${selectedDate.format('DD/MM/YYYY')}`);
    return filters.length > 0 ? ` - ${filters.join(', ')}` : '';
  };

  const getFilterLabel = (filter: StatisticFilter) => {
    switch (filter) {
      case 'all':
        return 'Tất cả người đăng ký';
      case 'checkedIn':
        return 'Đã check-in';
      case 'notCheckedIn':
        return 'Chưa check-in';
      default:
        return 'Tất cả người đăng ký';
    }
  };

  return {
    // States
    statisticFilter,
    selectedProvinceCode,
    selectedDistrictCode,
    selectedDate,
    showAdvancedFilters,
    openCharts,

    // Data
    provinces,
    districts,
    statisticData,
    provincesLoading,
    districtsLoading,

    // Computed values
    selectedProvinceName,
    selectedDistrictName,
    hasAgeChart,
    hasGenderChart,
    hasReferenceChart,
    hasAddressChart,
    hasAttendedBeforeChart,
    hasAnyChart,

    // Actions
    setStatisticFilter,
    setShowAdvancedFilters,
    setSelectedDate,
    toggleChart,
    clearFilters,
    handleProvinceChange,
    handleDistrictChange,

    // Helper functions
    getActiveFiltersCount,
    getFilterDescription,
    getFilterLabel,
  };
};
