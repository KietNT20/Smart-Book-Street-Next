'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStatisticEventRegistrations } from '@/hooks/use-event-registrations';
import { useDistricts, useProvinces } from '@/hooks/use-provinces';
import { EventRegistrationStatisticParams } from '@/types/event-registrations-types';
import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart4,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  MapPin,
  PieChart,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import EventBarchart from '../event-barchart';
import EventChart from '../event-statistics-charts';
import StatisticsExportButton from '../export-excel-button';

type Props = {
  eventId: string;
};

type StatisticFilter = 'all' | 'checkedIn' | 'notCheckedIn';

const EventStatistics = ({ eventId }: Props) => {
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
  const [openCharts, setOpenCharts] = useState({
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

    // Attendance filter
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

    // Location filters - using name for API compatibility
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

    // Date filter
    if (selectedDate) {
      params.date = selectedDate.format('YYYY-MM-DD');
    }

    // Return undefined if no filters are applied
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

  // Memoized values for performance
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

  const toggleChart = (chart: keyof typeof openCharts) => {
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
    setSelectedDistrictCode(null); // Reset district when province changes
  };

  const handleDistrictChange = (value: string) => {
    const districtCode = value && value !== 'all' ? parseInt(value) : null;
    setSelectedDistrictCode(districtCode);
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
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

  if (!hasAnyChart) return null;

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <BarChart4 className='h-5 w-5' />
              Thống kê người tham gia
            </CardTitle>
            <div className='mt-2 flex flex-col gap-2'>
              <CardDescription>
                {getFilterLabel(statisticFilter)}:{' '}
                {statisticData?.totalRegistrations || 0}
                {getFilterDescription()}
              </CardDescription>
              {statisticFilter === 'all' && statisticData?.participation && (
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    <UserCheck className='mr-1 h-3 w-3' />
                    Đã tham dự: {statisticData.participation}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    Tỷ lệ: {statisticData.participationRate}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <StatisticsExportButton eventId={eventId} />
        </div>

        {/* Basic Filter Buttons */}
        <div className='flex flex-wrap gap-2 border-t pt-4'>
          <Button
            variant={statisticFilter === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('all')}
            className='flex items-center gap-2'
          >
            <Users className='h-4 w-4' />
            Tất cả
            {statisticFilter === 'all' && statisticData?.totalRegistrations && (
              <Badge variant='secondary' className='ml-1'>
                {statisticData.totalRegistrations}
              </Badge>
            )}
          </Button>
          <Button
            variant={statisticFilter === 'checkedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('checkedIn')}
            className='flex items-center gap-2'
          >
            <UserCheck className='h-4 w-4' />
            Đã check-in
            {statisticFilter === 'checkedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData.totalRegistrations}
                </Badge>
              )}
          </Button>
          <Button
            variant={statisticFilter === 'notCheckedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('notCheckedIn')}
            className='flex items-center gap-2'
          >
            <UserX className='h-4 w-4' />
            Chưa check-in
            {statisticFilter === 'notCheckedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData.totalRegistrations}
                </Badge>
              )}
          </Button>

          {/* Advanced Filters Toggle */}
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            size='sm'
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            Bộ lọc nâng cao
            {getActiveFiltersCount() > (statisticFilter !== 'all' ? 1 : 0) && (
              <Badge variant='secondary' className='ml-1'>
                {getActiveFiltersCount() - (statisticFilter !== 'all' ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence initial={false}>
          {showAdvancedFilters && (
            <motion.div
              variants={contentVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='border-t pt-4'
            >
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {/* Province Filter */}
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2 text-sm font-medium'>
                    <MapPin className='h-4 w-4' />
                    Tỉnh/Thành phố
                  </Label>
                  {provincesLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <Select
                      value={selectedProvinceCode?.toString() || 'all'}
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn tỉnh/thành phố' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        {provinces?.map((province) => (
                          <SelectItem
                            key={province.code}
                            value={province.code.toString()}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* District Filter */}
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2 text-sm font-medium'>
                    <MapPin className='h-4 w-4' />
                    Quận/Huyện
                  </Label>
                  {districtsLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <Select
                      value={selectedDistrictCode?.toString() || 'all'}
                      onValueChange={handleDistrictChange}
                      disabled={!selectedProvinceCode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn quận/huyện' />
                        {districtsLoading && (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        {districts?.map((district) => (
                          <SelectItem
                            key={district.code}
                            value={district.code.toString()}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Date Filter */}
                <div className='space-y-2'>
                  <Label className='flex items-center gap-2 text-sm font-medium'>
                    <Calendar className='h-4 w-4' />
                    Ngày đăng ký
                  </Label>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder='Chọn ngày'
                    format='DD/MM/YYYY'
                    className='h-10 w-full'
                    allowClear
                  />
                </div>
              </div>

              {/* Filter Summary */}
              {getActiveFiltersCount() > 0 && (
                <div className='mt-4 flex flex-wrap items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>
                    Bộ lọc đang áp dụng:
                  </span>
                  {selectedProvinceName && (
                    <Badge variant='secondary' className='text-xs'>
                      {selectedProvinceName}
                    </Badge>
                  )}
                  {selectedDistrictName && (
                    <Badge variant='secondary' className='text-xs'>
                      {selectedDistrictName}
                    </Badge>
                  )}
                  {selectedDate && (
                    <Badge variant='secondary' className='text-xs'>
                      {selectedDate.format('DD/MM/YYYY')}
                    </Badge>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearFilters}
                    className='h-6 px-2 text-xs'
                  >
                    Xóa tất cả
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className='space-y-4 overflow-hidden'>
        {/* Age Chart Collapsible */}
        {hasAgeChart && (
          <Collapsible
            open={openCharts.age}
            onOpenChange={() => toggleChart('age')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <BarChart4 className='mr-2 h-4 w-4' />
                  Phân bố độ tuổi
                </div>
                {openCharts.age ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.age && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê độ tuổi - {getFilterLabel(statisticFilter)}
                      {getFilterDescription()}
                    </div>
                    <div className='w-full'>
                      <EventBarchart
                        data={statisticData.ageChart || []}
                        title='Phân bố độ tuổi'
                        description={`Thống kê độ tuổi - ${getFilterLabel(statisticFilter)}`}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Gender Chart Collapsible */}
        {hasGenderChart && (
          <Collapsible
            open={openCharts.gender}
            onOpenChange={() => toggleChart('gender')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Phân bố giới tính
                </div>
                {openCharts.gender ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.gender && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê giới tính - {getFilterLabel(statisticFilter)}
                      {getFilterDescription()}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.genderChart || []}
                        title='Phân bố giới tính'
                        description={`Thống kê giới tính - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Reference Chart Collapsible */}
        {hasReferenceChart && (
          <Collapsible
            open={openCharts.reference}
            onOpenChange={() => toggleChart('reference')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Nguồn tham khảo
                </div>
                {openCharts.reference ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.reference && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Người tham gia biết về sự kiện qua đâu -{' '}
                      {getFilterLabel(statisticFilter)}
                      {getFilterDescription()}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.referenceChart || []}
                        title='Nguồn tham khảo'
                        description={`Người tham gia biết về sự kiện qua đâu - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Address Chart Collapsible */}
        {hasAddressChart && (
          <Collapsible
            open={openCharts.address}
            onOpenChange={() => toggleChart('address')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Phân bố địa điểm
                </div>
                {openCharts.address ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.address && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê nơi đến của người tham gia -{' '}
                      {getFilterLabel(statisticFilter)}
                      {getFilterDescription()}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.addressChart || []}
                        title='Phân bố địa điểm'
                        description={`Thống kê nơi đến của người tham gia - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Attended Before Chart Collapsible */}
        {hasAttendedBeforeChart && (
          <Collapsible
            open={openCharts.attendedBefore}
            onOpenChange={() => toggleChart('attendedBefore')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Lịch sử tham gia
                </div>
                {openCharts.attendedBefore ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.attendedBefore && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê lịch sử tham gia sự kiện -{' '}
                      {getFilterLabel(statisticFilter)}
                      {getFilterDescription()}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.attendedBeforeChart || []}
                        title='Lịch sử tham gia'
                        description={`Thống kê lịch sử tham gia sự kiện - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default EventStatistics;
