export type ImageType = {
  id: string;
  url: string;
  type: string;
  altText: string;
  entityId: string;
};

export type ImagePayload = {
  id: string;
  files: Array<File>;
  type: string;
  altText: string;
  entityId: string;
};

export type ImageApiResponse = {
  results: Array<ImageType>;
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type ImageResArr = Array<ImageType>;
