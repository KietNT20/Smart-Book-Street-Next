export type Street = {
  id: string;
  streetName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  baseImgUrl: string;
};

export type StreetsResponse = {
  results: Street[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};
