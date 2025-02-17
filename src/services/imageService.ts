import { API_ENDPOINT } from '@/constant/api-url';
import { ImagePayload } from '@/types/image-types';
import axiosInstance from '@/utils/axiosInstance';

export const imageService = {
  add: async (payload: Array<ImagePayload>) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.IMAGES.ADD}`, payload);
    return res.data;
  },
  getByTypeOrEntityID: async (payload: {
    type?: string;
    entityId?: string;
  }) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.IMAGES.GET_BY_TYPE_OR_ENTITY_ID}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.IMAGES.DELETE}?id=${id}`
    );
    return res.data;
  },
};
