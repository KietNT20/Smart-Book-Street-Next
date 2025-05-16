import { API_ENDPOINT } from '@/enums/endpoint';

const AUTHOR = API_ENDPOINT.AUTHOR;
const BOOK = API_ENDPOINT.BOOK;
const BOOK_AUTHOR = API_ENDPOINT.BOOK_AUTHOR;
const STORE = API_ENDPOINT.STORE;
const PUBLISHER = API_ENDPOINT.PUBLISHER;
const SOUVENIR = API_ENDPOINT.SOUVENIR;
const USER = API_ENDPOINT.USER;
const USER_STORE = API_ENDPOINT.USER_STORE;
const BOOK_CATEGORY = API_ENDPOINT.BOOK_CATEGORY;
const CATEGORY = API_ENDPOINT.CATEGORY;
const EVENT = API_ENDPOINT.EVENT;
const IMAGE = API_ENDPOINT.IMAGE;
const INVENTORY = API_ENDPOINT.INVENTORY;
const STREET = API_ENDPOINT.STREET;
const ZONE = API_ENDPOINT.ZONE;
const ORDER = API_ENDPOINT.ORDER;
const ORDER_DETAILS = API_ENDPOINT.ORDER_DETAILS;
const STORE_SCHEDULES = API_ENDPOINT.STORE_SCHEDULES;
const EVENT_REGISTRATION = API_ENDPOINT.EVENT_REGISTRATION;

export const API_URL = {
  AUTHORS: {
    INDEX: `${AUTHOR}`,
    SEARCH: `${AUTHOR}/search`,
    PAGINATION_SEARCH: `${AUTHOR}/search/paginated`,
  },
  BOOKS: {
    INDEX: `${BOOK}`,
    PAGINATION_SEARCH: `${BOOK}/search/paginated`,
    SEARCH: `${BOOK}/search`,
    PAGINATED: `${BOOK}/paginated`,
  },
  BOOK_AUTHORS: {
    INDEX: `${BOOK_AUTHOR}`,
    PAGINATION_SEARCH: `${BOOK_AUTHOR}/search/paginated`,
    FILTER: `${BOOK_AUTHOR}/filter`,
  },
  BOOK_CATEGORIES: {
    INDEX: `${BOOK_CATEGORY}`,
    PAGINATION_SEARCH: `${BOOK_CATEGORY}/search/paginated`,
    FILTER: `${BOOK_CATEGORY}/filter`,
  },
  CATEGORIES: {
    INDEX: `${CATEGORY}`,
    PAGINATION_SEARCH: `${CATEGORY}/search/paginated`,
    SEARCH: `${CATEGORY}/search`,
  },
  EVENTS: {
    INDEX: `${EVENT}`,
    COMING: `${EVENT}/events-coming`,
    PAGINATED: `${EVENT}/paginated`,
    IN_MONTH: `${EVENT}/event-dates-in-month`,
    IN_DATE: `${EVENT}/events-in-date`,
    PAGINATION_SEARCH: `${EVENT}/search/paginated`,
    PROCESS_REQUEST: `${EVENT}/process-request`,
    REQUEST_HISTORY: `${EVENT}/request-history`,
    REQUEST_CREATE_EVENT: `${EVENT}/request-create-event`,
    EVENT_OPEN_STATE: `${EVENT}/event-open-state`,
    STAFF: `${EVENT}/staff`,
    STATISTICS: `${EVENT}/statistic/total`,
    EVENT_DATES_IN_MONTH: `${EVENT}/event-dates-in-month`,
    EVENTS_IN_DATE: `${EVENT}/events-in-date`,
  },
  IMAGES: {
    INDEX: `${IMAGE}`,
    LIST: `${IMAGE}/list`,
    GET_BY_TYPE_OR_ENTITY_ID: `${IMAGE}/get-by-type-or-entityID`,
  },
  INVENTORIES: {
    INDEX: `${INVENTORY}`,
    PAGINATION_SEARCH: `${INVENTORY}/search/paginated`,
    BY_BOOK: `${INVENTORY}/book`,
    BY_STORE: `${INVENTORY}/store`,
    SCAN: `${INVENTORY}/scan`,
  },
  PUBLISHERS: {
    INDEX: `${PUBLISHER}`,
    PAGINATED: `${PUBLISHER}/paginated`,
    SEARCH: `${PUBLISHER}/search`,
    PAGINATION_SEARCH: `${PUBLISHER}/search/paginated`,
  },
  SOUVENIRS: {
    INDEX: `${SOUVENIR}`,
    PAGINATION_SEARCH: `${SOUVENIR}/search/paginated`,
  },
  STORES: {
    INDEX: `${STORE}`,
    PAGINATED: `${STORE}/paginated`,
    SEARCH: `${STORE}/search`,
    PAGINATION_SEARCH: `${STORE}/search/paginated`,
  },
  STREETS: {
    INDEX: `${STREET}`,
    PAGINATION_SEARCH: `${STREET}/search/paginated`,
  },
  ZONES: {
    INDEX: `${ZONE}`,
    PAGINATION_SEARCH: `${ZONE}/search/paginated`,
    STREET: `${ZONE}/street`,
  },
  USERS: {
    INDEX: `${USER}`,
    LOGIN: `${USER}/login`,
    REGISTER: `${USER}/register`,
    PROFILE: `${USER}/profile`,
    PAGINATED: `${USER}/paginated`,
    SEARCH: `${USER}/search`,
    PAGINATION_SEARCH: `${USER}/search/paginated`,
    GET_BY_EMAIL: `${USER}/by-email`,
    CHANGE_PASS_FIRST_TIME: `${USER}/change-password-first-time`,
  },
  USER_STORES: {
    INDEX: `${USER_STORE}`,
    USER: `${USER_STORE}/user`,
    STORE: `${USER_STORE}/store`,
    PAGINATED: `${USER_STORE}/paginated`,
    SEARCH: `${USER_STORE}/search`,
    PAGINATION_SEARCH: `${USER_STORE}/search/paginated`,
  },
  ORDERS: {
    INDEX: `${ORDER}`,
    PAGINATION_SEARCH: `${ORDER}/search/paginated`,
    SEARCH: `${ORDER}/search`,
    CONFIRM: `${ORDER}/confirm-order`,
    CANCEL: `${ORDER}/cancel-order`,
    STATISTICS_DAILY: `${ORDER}/statics-for-admin/daily`,
    STATISTICS_MONTHLY: `${ORDER}/statics-for-admin/monthly`,
    STATISTICS_YEARLY: `${ORDER}/statics-for-admin/yearly`,
    STATISTICS_DAILY_SM: `${ORDER}/statics-for-store/daily`,
    STATISTICS_MONTHLY_SM: `${ORDER}/statics-for-store/monthly`,
    STATISTICS_YEARLY_SM: `${ORDER}/statics-for-store/yearly`,
  },
  ORDER_DETAILS: {
    INDEX: `${ORDER_DETAILS}`,
    CART: `${ORDER_DETAILS}/cart`,
    SEARCH: `${ORDER_DETAILS}/search`,
  },
  STORE_SCHEDULES: {
    INDEX: `${STORE_SCHEDULES}`,
    STORE: `${STORE_SCHEDULES}/store`,
  },
  EVENT_REGISTRATIONS: {
    INDEX: `${EVENT_REGISTRATION}`,
    GET_ALL: `${EVENT_REGISTRATION}/get-all`,
    STATISTIC: `${EVENT_REGISTRATION}/statistic`,
  },
} as const;
