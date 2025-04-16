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
