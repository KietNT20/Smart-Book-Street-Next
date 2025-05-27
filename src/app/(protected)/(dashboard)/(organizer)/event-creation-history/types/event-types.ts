import { ImageType } from '@/types/image-types';

export type EventData = {
  id: string;
  eventName: string;
  organizerEmail: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  baseImgUrl: string | null;
  videoLink: string | null;
  isOpen: boolean;
  allowAds: boolean;
  isDeleted: boolean;
  version: number;
  isApprove: boolean;
  message: string;
  updateForEventId: string | null;
  createdDate: string;
  lastUpdatedDate: string;
  zone: {
    id: string;
    zoneName: string;
    description: string;
    isDeleted: boolean;
    latitude: number;
    longitude: number;
    street: {
      id: string;
      streetName: string;
      address: string;
      description: string;
      latitude: number;
      longitude: number;
      baseImgUrl: string;
      isDeleted: boolean;
      images: ImageType[];
    };
  };
  images: ImageType[];
  eventSchedules: {
    id: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    eventId: string;
  }[];
  totalRegistrations: number;
};
