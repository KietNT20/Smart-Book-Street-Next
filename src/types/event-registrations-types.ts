import { Gender } from '@/enums/gender';
import { EventStatistics } from './event-types';
import { Zone } from './zone-types';

export interface EventRegistrationsResponse {
  results: EventRegistrations[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
}

export interface EventRegistrations {
  id: string;
  registrantName: string;
  registrantEmail: string;
  registrantPhoneNumber: string;
  registrantAgeRange: string;
  registrantGender: Gender;
  registrantAddress: string;
  referenceSource: string;
  hasAttendedBefore: boolean;
  isAttended: boolean;
}

export interface EventRegistrationStatistic {
  success: boolean;
  addressChart: EventStatistics[];
  ageChart: EventStatistics[];
  attendedBeforeChart: EventStatistics[];
  genderChart: EventStatistics[];
  participation: number;
  participationRate: string;
  referenceChart: EventStatistics[];
  attendedChart?: EventStatistics[];
  totalRegistrations: number;
}

export type CheckedAttendendPayload = Array<{
  id: string;
  isAttended: boolean;
  ticketCode?: string | null;
}>;

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface CustomExportOptions {
  includeGeneral?: boolean;
  includeAge?: boolean;
  includeGender?: boolean;
  includeReference?: boolean;
  includeAddress?: boolean;
}

export interface ExportStatisticsRequest {
  eventId: string;
  eventName: string;
  description: string;
  statistics: EventRegistrationStatistic;
  zoneInfo: Zone;
  dateRange: DateRange;
  organizerEmail: string;
  emailSubject?: string;
  emailMessage?: string;
  customOptions?: CustomExportOptions;
}

export interface ExportStatisticsResponse {
  success: boolean;
  message: string;
  emailInfo?: string;
}

export interface EventRegistrationStatisticParams {
  isAttended?: boolean;
  province?: string;
  district?: string;
  date?: string;
}
