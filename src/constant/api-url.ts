const USER = '/api/user';

export const API_ENDPOINT = {
  USERS: {
    LOGIN: `${USER}/login`,
    REGISTER: `${USER}/register`,
  },
} as const;
