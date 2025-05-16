import { ApiListResponse, ApiResponse, PaginationSchema } from './common-types';
import { ImageType } from './image-types';
import { Trend } from './person-types';
import { Zone } from './zone-types';

export interface EventStatistics {
  label: string;
  value: number;
}

export interface EventSchedule {
  id: string;
  eventDate: string | Date | null;
  startTime: string;
  endTime: string;
  eventId: string;
}

export interface Event {
  id: string;
  eventName: string;
  description: string;
  startDate: string | Date | null;
  endDate: string | Date | null;
  baseImgUrl: string;
  videoLink: string | null;
  isOpen: boolean;
  allowAds: boolean;
  isDeleted: boolean;
  version: number;
  isApprove: boolean;
  message: string | null;
  updateForEventId: string | null;
  zone: Zone;
  images: ImageType[];
  eventSchedules: EventSchedule[];
  ageChart: EventStatistics[] | null;
  genderChart: EventStatistics[] | null;
  referenceChart: EventStatistics[] | null;
  addressChart: EventStatistics[] | null;
  totalRegistrations?: number;
}

export interface EventsInMonth {
  results: EventDate[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
}

export interface EventDate {
  eventDate: Date;
}

export interface EventSearchCriteria {
  key?: string;
  allowAds?: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  zoneId?: string;
}

export type EventParams = PaginationSchema<EventSearchCriteria>;
export type EventsResponse = ApiListResponse<Event & { id: string }>;
export type EventDetailResponse = ApiResponse<Event & { id: string }>;

export interface EventStaticsInMonth {
  success: boolean;
  total: number;
  change: number;
  direction: Trend;
}

export interface EventInDate {
  id: string;
  eventName: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  baseImgUrl: string;
  videoLink: string;
  isOpen: boolean;
  allowAds: boolean;
}

export type EventInDateResponse = ApiListResponse<EventInDate>;
