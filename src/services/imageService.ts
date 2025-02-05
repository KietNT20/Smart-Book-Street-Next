import { API_ENDPOINT } from '@/constant/api-url';
import { ImagePayload } from '@/types/image-types';
import axiosInstance from '@/utils/axiosInstance';

export const imageService = {
  add: async (payload: Array<ImagePayload>) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.IMAGES.ADD}`, payload);
    return res.data;
  },
  getByTypeAndEntityID: async (type?: string, entityID?: string) => {
    if (!type) {
      const res = await axiosInstance.get(
        `${API_ENDPOINT.IMAGES.GET_BY_TYPE_AND_ENTITY_ID}?entityID=${entityID}`
      );
      return res.data;
    }
    const res = await axiosInstance.get(
      `${API_ENDPOINT.IMAGES.GET_BY_TYPE_AND_ENTITY_ID}?type=${type}&entityID=${entityID}`
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(
      `${API_ENDPOINT.IMAGES.DELETE}/${id}`
    );
    return res.data;
  },
};
