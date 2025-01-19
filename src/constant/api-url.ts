// Note: API URL constants
const USER = '/api/user';
const USER_ROLE = '/api/UserRole';
const ROLE = '/api/Role';

export const API_ENDPOINT = {
  USERS: {
    LOGIN: `${USER}/login`,
    REGISTER: `${USER}/register`,
    GET_ALL: `${USER}/get-all`,
    GET_ALL_PAGINATION: `${USER}/get-all-pagination`,
    GET_BY_ID: `${USER}/get-by-id`,
    GET_BY_EMAIL: `${USER}/get-by-email`,
    SEARCH: `${USER}/search`,
    ADD: `${USER}/add`,
    UPDATE: `${USER}/update`,
    DELETE: `${USER}/delete`,
  },
  USER_ROLES: {
    GET_ALL: `${USER_ROLE}/get-all`,
    GET_BY_ROLE_ID: `${USER_ROLE}/get-by-role`,
    GET_BY_USER_ID: `${USER_ROLE}/get-by-user`,
    ADD: `${USER_ROLE}/add`,
    DELETE: `${USER_ROLE}/delete`,
  },
  ROLES: {
    GET_ALL: `${ROLE}/get-all`,
    ADD: `${ROLE}/add`,
    DELETE: `${ROLE}/delete`,
  },
} as const;
