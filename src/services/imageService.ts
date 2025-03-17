import { API_ENDPOINT } from '@/constant/api-url';
import { ImagePayload } from '@/types/image-types';
import axiosInstance from '@/utils/axiosInstance';

export type UploadImagePayload = Partial<Omit<ImagePayload, 'id'>>;

export const imageService = {
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

  create: async (payload: UploadImagePayload) => {
    const formData = new FormData();

    if (payload.files && payload.files.length > 0) {
      for (const file of payload.files) {
        formData.append('files', file);
      }
    }

    formData.append('type', payload.type ?? '');
    formData.append('altText', payload.altText ?? '');
    formData.append('entityId', payload.entityId ?? '');

    // Send the FormData object
    const res = await axiosInstance.post(
      `${API_ENDPOINT.IMAGES.ADD}`,
      formData
    );
    return res.data;
  },

  update: async (payload: Partial<ImagePayload>) => {
    // For updates that include files, also use FormData
    const formData = new FormData();

    // Append each property to the FormData
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'files' && Array.isArray(value)) {
        for (const file of value) {
          formData.append('files', file);
        }
      } else {
        formData.append(key, String(value));
      }
    }

    const res = await axiosInstance.put(`${API_ENDPOINT.IMAGES.ADD}`, formData);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.IMAGES.DELETE}?id=${id}`
    );
    return res.data;
  }
};
