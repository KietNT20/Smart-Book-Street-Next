import { API_URL } from '@/constant/api-url';
import { UserStoreResponseAll } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userStoreService = {
  registerUserStore: async (data: FormData) => {
    const res = await axiosInstance.post(`${API_URL.USER_STORES.INDEX}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  checkUserContract: async (userId: string): Promise<UserStoreResponseAll> => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.USER}/${userId}`
    );
    return res.data;
  },
  checkStoreContract: async (
    storeId: string
  ): Promise<UserStoreResponseAll> => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.STORE}/${storeId}`
    );
    return res.data;
  },
  deleteUserStore: async (userId: string, storeId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.USER_STORES.INDEX}/${userId}/${storeId}`
    );
    return res.data;
  },
  getUserStores: async (): Promise<UserStoreResponseAll> => {
    const res = await axiosInstance.get(`${API_URL.USER_STORES.INDEX}`);
    return res.data;
  },
  downloadUserStoreContract: async (userId: string, storeId: string) => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.DOWNLOAD_CONTRACT}/${userId}/${storeId}`,
      {
        responseType: 'blob',
      }
    );

    const contentDisposition = res.headers['content-disposition'];
    let filename = 'hop_dong.pdf';

    if (contentDisposition) {
      // Tìm filename*=UTF-8'' trước (cho tiếng Việt)
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
      if (utf8Match) {
        filename = decodeURIComponent(utf8Match[1]);
      } else {
        // Fallback sang filename= thường
        const normalMatch = contentDisposition.match(/filename=([^;]+)/);
        if (normalMatch) {
          filename = normalMatch[1].replace(/"/g, '').trim();
        }
      }
    }

    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return res.data;
  },
};
