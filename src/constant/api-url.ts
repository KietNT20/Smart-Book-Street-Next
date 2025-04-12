import { API_ENDPOINT } from '@/enums/endpoint';

const AUTHOR = API_ENDPOINT.AUTHOR;
const BOOK = API_ENDPOINT.BOOK;
const BOOK_AUTHOR = API_ENDPOINT.BOOK_AUTHOR;
const STORE = API_ENDPOINT.STORE;
const PUBLISHER = API_ENDPOINT.PUBLISHER;
const ROLE = API_ENDPOINT.ROLE;
const SOUVENIR = API_ENDPOINT.SOUVENIR;
const USER = API_ENDPOINT.USER;
const USER_ROLE = API_ENDPOINT.USER_ROLE;
const USER_STORE = API_ENDPOINT.USER_STORE;
const BOOK_CATEGORY = API_ENDPOINT.BOOK_CATEGORY;
const CATEGORY = API_ENDPOINT.CATEGORY;
const EVENT = API_ENDPOINT.EVENT;
const IMAGE = API_ENDPOINT.IMAGE;
const INVENTORY = API_ENDPOINT.INVENTORY;
const STREET = API_ENDPOINT.STREET;
const ZONE = API_ENDPOINT.ZONE;

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
    DATES_IN_MONTH: `${EVENT}/event-dates-in-month`,
    IN_DATE: `${EVENT}/events-in-date`,
  },
  IMAGES: {
    INDEX: `${IMAGE}`,
    LIST: `${IMAGE}/list`,
    GET_BY_TYPE_OR_ENTITY_ID: `${IMAGE}/get-by-type-or-entityID`,
  },
  INVENTORIES: {
    INDEX: `${INVENTORY}`,
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
  },
  USER_ROLES: {
    INDEX: `${USER_ROLE}`,
  },
  USER_STORES: {
    INDEX: `${USER_STORE}`,
    PAGINATED: `${USER_STORE}/paginated`,
    SEARCH: `${USER_STORE}/search`,
    PAGINATION_SEARCH: `${USER_STORE}/search/paginated`,
  },
  ROLES: {
    INDEX: `${ROLE}`,
  },
} as const;
