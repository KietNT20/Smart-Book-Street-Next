import { ImageType } from './image-types';

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
  zone: null;
  images: ImageType[];
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
