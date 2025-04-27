import { ApiListResponse, ApiResponse, PaginationSchema } from './common-types';
import { ImageType } from './image-types';
import { Trend } from './person-types';
import { Zone } from './zone-types';

export interface EventStatistics {
  label: string;
  value: number;
}

export interface Event {
  id: string;
  eventName: string;
  description: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
  baseImgUrl: string;
  videoLink: string;
  isOpen: boolean;
  allowAds: boolean;
  isDeleted: boolean;
  zone: Zone;
  images: ImageType[];
  ageChart: EventStatistics[];
  genderChart: EventStatistics[];
  referenceChart: EventStatistics[];
  addressChart: EventStatistics[];
  totalRegistrations: number;
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
