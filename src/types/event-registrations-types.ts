import { Gender } from '@/enums/gender';
import { EventStatistics } from './event-types';

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
  ageChart: EventStatistics[];
  genderChart: EventStatistics[];
  referenceChart: EventStatistics[];
  addressChart: EventStatistics[];
  attendedChart: EventStatistics[];
  totalRegistrations: number;
  participation: number;
  participationRate: string;
}
