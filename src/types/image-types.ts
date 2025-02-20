export type Image = {
  id: string;
  url: string;
  type: string;
  altText: string;
  entityId: string;
};

export type ImagePayload = {
  url: string;
  type: string;
  altText: string;
  entityId: string;
};

export type ImageResponse = {
  results: Array<Image>;
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type ImageResArr = Array<Image>;
