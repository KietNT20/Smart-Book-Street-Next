import { BaseEntity } from './common-types';

export interface StoreData extends BaseEntity {
  bookStoreName: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
  mainImageFile: string;
  additionalImageFiles: string[];
  latitude: number;
  longitude: number;
  type: string;
  managerId: string;
  zoneId: string;
}
