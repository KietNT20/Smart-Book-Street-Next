import { Gender } from '@/enums/gender';

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
