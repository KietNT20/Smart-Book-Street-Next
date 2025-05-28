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
import { DatePicker } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
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
import { useEventStatistics } from '../../_hooks/use-event-statistics';
import EventBarchart from '../event-barchart';
import EventChart from '../event-statistics-charts';
import ExportStatisticsComp from '../export-statistics';

type Props = {
  eventId: string;
  organizerEmail?: string;
};

const EventStatistics = ({ eventId, organizerEmail }: Props) => {
  const {
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
  } = useEventStatistics(eventId);

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

  // Component hiển thị khi không có dữ liệu
  const NoDataMessage = ({ message }: { message: string }) => (
    <div className='flex flex-col items-center justify-center py-8 text-center'>
      <AlertCircle className='mb-4 h-12 w-12 text-muted-foreground' />
      <h3 className='mb-2 text-lg font-semibold text-muted-foreground'>
        Không có dữ liệu
      </h3>
      <p className='text-sm text-muted-foreground'>{message}</p>
    </div>
  );

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
                    Đã tham dự: {statisticData?.participation}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    Tỷ lệ: {statisticData?.participationRate}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <ExportStatisticsComp
            eventId={eventId}
            defaultEmail={organizerEmail || ''}
          />
        </div>

        {/* Basic Filter Buttons */}
        <div className='flex flex-wrap gap-2 border-t pt-4'>
          <Button
            variant={statisticFilter === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('all')}
            className='flex items-center gap-2'
          >
            <Users className='size-4' />
            Tất cả
            {statisticFilter === 'all' && statisticData?.totalRegistrations && (
              <Badge variant='secondary' className='ml-1'>
                {statisticData?.totalRegistrations}
              </Badge>
            )}
          </Button>
          <Button
            variant={statisticFilter === 'checkedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('checkedIn')}
            className='flex items-center gap-2'
          >
            <UserCheck className='size-4' />
            Đã check-in
            {statisticFilter === 'checkedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData?.totalRegistrations}
                </Badge>
              )}
          </Button>
          <Button
            variant={statisticFilter === 'notCheckedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('notCheckedIn')}
            className='flex items-center gap-2'
          >
            <UserX className='size-4' />
            Chưa check-in
            {statisticFilter === 'notCheckedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData?.totalRegistrations}
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
            <Filter className='size-4' />
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
                    <MapPin className='size-4' />
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
                    <MapPin className='size-4' />
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
                          <Loader2 className='size-4 animate-spin' />
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
                    <Calendar className='size-4' />
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
        {!hasAnyChart ? (
          <NoDataMessage message='Không có dữ liệu biểu đồ cho bộ lọc hiện tại. Vui lòng thử thay đổi bộ lọc.' />
        ) : (
          <>
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
                      <BarChart4 className='mr-2 size-4' />
                      Phân bố độ tuổi
                    </div>
                    {openCharts.age ? (
                      <ChevronUp className='size-4' />
                    ) : (
                      <ChevronDown className='size-4' />
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
                        <div className='w-full'>
                          {statisticData?.ageChart &&
                          statisticData.ageChart.length > 0 ? (
                            <EventBarchart
                              data={statisticData.ageChart}
                              title='Phân bố độ tuổi'
                              description={`Thống kê độ tuổi - ${getFilterLabel(statisticFilter)}`}
                            />
                          ) : (
                            <NoDataMessage message='Không có dữ liệu phân bố độ tuổi cho bộ lọc hiện tại.' />
                          )}
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
                      <PieChart className='mr-2 size-4' />
                      Phân bố giới tính
                    </div>
                    {openCharts.gender ? (
                      <ChevronUp className='size-4' />
                    ) : (
                      <ChevronDown className='size-4' />
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
                        <div className='w-full'>
                          {statisticData?.genderChart &&
                          statisticData.genderChart.length > 0 ? (
                            <EventChart
                              data={statisticData.genderChart}
                              title='Phân bố giới tính'
                              description={`Thống kê giới tính - ${getFilterLabel(statisticFilter)}`}
                              type='pie'
                              height={200}
                            />
                          ) : (
                            <NoDataMessage message='Không có dữ liệu phân bố giới tính cho bộ lọc hiện tại.' />
                          )}
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
                      <PieChart className='mr-2 size-4' />
                      Nguồn tham khảo
                    </div>
                    {openCharts.reference ? (
                      <ChevronUp className='size-4' />
                    ) : (
                      <ChevronDown className='size-4' />
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
                        <div className='w-full'>
                          {statisticData?.referenceChart &&
                          statisticData.referenceChart.length > 0 ? (
                            <EventChart
                              data={statisticData.referenceChart}
                              title='Nguồn tham khảo'
                              description={`Người tham gia biết về sự kiện qua đâu - ${getFilterLabel(statisticFilter)}`}
                              type='pie'
                              height={200}
                            />
                          ) : (
                            <NoDataMessage message='Không có dữ liệu nguồn tham khảo cho bộ lọc hiện tại.' />
                          )}
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
                      <PieChart className='mr-2 size-4' />
                      Phân bố địa điểm
                    </div>
                    {openCharts.address ? (
                      <ChevronUp className='size-4' />
                    ) : (
                      <ChevronDown className='size-4' />
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
                        <div className='w-full'>
                          {statisticData?.addressChart &&
                          statisticData.addressChart.length > 0 ? (
                            <EventChart
                              data={statisticData.addressChart}
                              title='Phân bố địa điểm'
                              description={`Thống kê nơi đến của người tham gia - ${getFilterLabel(statisticFilter)}`}
                              type='pie'
                              height={200}
                            />
                          ) : (
                            <NoDataMessage message='Không có dữ liệu phân bố địa điểm cho bộ lọc hiện tại.' />
                          )}
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
                      <PieChart className='mr-2 size-4' />
                      Lịch sử tham gia
                    </div>
                    {openCharts.attendedBefore ? (
                      <ChevronUp className='size-4' />
                    ) : (
                      <ChevronDown className='size-4' />
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
                        <div className='w-full'>
                          {statisticData?.attendedBeforeChart &&
                          statisticData.attendedBeforeChart.length > 0 ? (
                            <EventChart
                              data={statisticData.attendedBeforeChart}
                              title='Lịch sử tham gia'
                              description={`Thống kê lịch sử tham gia sự kiện - ${getFilterLabel(statisticFilter)}`}
                              type='pie'
                              height={200}
                            />
                          ) : (
                            <NoDataMessage message='Không có dữ liệu lịch sử tham gia cho bộ lọc hiện tại.' />
                          )}
                        </div>
                      </motion.div>
                    </CollapsibleContent>
                  )}
                </AnimatePresence>
              </Collapsible>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EventStatistics;
