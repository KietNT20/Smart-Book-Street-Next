export type ImagePayload = {
  url: string;
  type: string;
  altText: string;
  entityId: string;
};

export type ImageResponse = {
  results: Array<{
    id: string;
    url: string;
    type: string;
    altText: string;
    entityId: string;
  }>;
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type ImageResArr = Array<{
  id: string;
  url: string;
  type: string;
  altText: string;
  entityId: string;
}>;
