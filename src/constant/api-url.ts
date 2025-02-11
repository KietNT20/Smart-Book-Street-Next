// Note: API URL constants
const USER = '/api/user';
const USER_ROLE = '/api/UserRole';
const ROLE = '/api/Role';
const AUTHOR = '/api/Author';
const BOOK = '/api/book';
const BOOK_AUTHOR = '/api/BookAuthor';
const BOOK_CATEGORY = '/api/BookCategory';
const BOOK_STORE = '/api/bookStore';
const CATEGORY = '/api/Category';
const EVENT = '/api/Event';
const IMAGE = '/api/Image';
const INVENTORY = '/api/inventory';
const PUBLISHER = '/api/publisher';
const STREET = '/api/Street';
const ZONE = '/api/Zone';

export const API_ENDPOINT = {
  AUTHORS: {
    ADD: `${AUTHOR}/add`,
    UPDATE: `${AUTHOR}/update`,
    DELETE: `${AUTHOR}/delete`,
    GET_BY_ID: `${AUTHOR}/get-by-id`,
    SEARCH: `${AUTHOR}/search-not-pagination`,
    PAGINATION_SEARCH: `${AUTHOR}/pagination-and-search`,
  },
  BOOKS: {
    GET_ALL: `${BOOK}/get-all`,
    GET_ALL_PAGINATION: `${BOOK}/get-all-pagination`,
    GET_BY_ID: `${BOOK}/get-by-id`,
    SEARCH_PAGINATION: `${BOOK}/search-pagination`,
    SEARCH: `${BOOK}/search-without-pagination`,
    ADD: `${BOOK}/add`,
    UPDATE: `${BOOK}/update`,
    DELETE: `${BOOK}/delete`,
  },
  BOOK_AUTHORS: {
    ADD: `${BOOK_AUTHOR}/add`,
    UPDATE: `${BOOK_AUTHOR}/update`,
    DELETE: `${BOOK_AUTHOR}/delete`,
    GET_BY_ID: `${BOOK_AUTHOR}/get-by-id`,
    GET_ALL_ACTIVE: `${BOOK_AUTHOR}/get-all-active`,
    PAGINATION_SEARCH: `${BOOK_AUTHOR}/pagination-and-search`,
    GET_ALL_BY_ELEMENT: `${BOOK_AUTHOR}/get-all-by-element`,
  },
  BOOK_CATEGORIES: {
    ADD: `${BOOK_CATEGORY}/add`,
    UPDATE: `${BOOK_CATEGORY}/update`,
    DELETE: `${BOOK_CATEGORY}/delete`,
    GET_BY_ID: `${BOOK_CATEGORY}/get-by-id`,
    GET_ALL_ACTIVE: `${BOOK_CATEGORY}/get-all-active`,
    PAGINATION_SEARCH: `${BOOK_CATEGORY}/pagination-and-search`,
    GET_ALL_BY_ELEMENT: `${BOOK_CATEGORY}/get-all-by-element`,
  },
  BOOK_STORES: {
    ADD: `${BOOK_STORE}/add`,
    UPDATE: `${BOOK_STORE}/update`,
    DELETE: `${BOOK_STORE}/delete`,
    SEARCH: `${BOOK_STORE}/search`,
    GET_ALL: `${BOOK_STORE}/get-all`,
    GET_BY_ID: `${BOOK_STORE}/get-by-id`,
    GET_ALL_PAGINATION: `${BOOK_STORE}/get-all-pagination`,
  },
  CATEGORIES: {
    ADD: `${CATEGORY}/add`,
    UPDATE: `${CATEGORY}/update`,
    DELETE: `${CATEGORY}/delete`,
    GET_BY_ID: `${CATEGORY}/get-by-id`,
    SEARCH: `${CATEGORY}/search-not-pagination`,
    PAGINATION_SEARCH: `${CATEGORY}/pagination-and-search`,
  },
  EVENTS: {
    ADD: `${EVENT}/add`,
    UPDATE: `${EVENT}/update`,
    DELETE: `${EVENT}/delete`,
    GET_BY_ID: `${EVENT}/get-by-id`,
    GET_EVENT_COMING: `${EVENT}/get-event-coming`,
    PAGINATION_SEARCH: `${EVENT}/pagination-and-search`,
  },
  IMAGES: {
    ADD: `${IMAGE}/add`,
    UPDATE: `${IMAGE}/update`,
    DELETE: `${IMAGE}/delete`,
    GET_BY_ID: `${IMAGE}/get-by-id`,
    GET_BY_TYPE_OR_ENTITY_ID: `${IMAGE}/get-by-type-or-entityID`,
  },
  INVENTORIES: {
    ADD: `${INVENTORY}/add`,
    DELETE: `${INVENTORY}/delete`,
    GET_ALL: `${INVENTORY}/get-all`,
    GET_BY_BOOK: `${INVENTORY}/get-by-book`,
    GET_BY_BOOK_STORE: `${INVENTORY}/get-by-bookstore`,
  },
  PUBLISHERS: {
    ADD: `${PUBLISHER}/add`,
    UPDATE: `${PUBLISHER}/update`,
    DELETE: `${PUBLISHER}/delete`,
    SEARCH: `${PUBLISHER}/search`,
    GET_ALL: `${PUBLISHER}/get-all`,
    GET_BY_ID: `${PUBLISHER}/get-by-id`,
    GET_ALL_PAGINATION: `${PUBLISHER}/get-all-pagination`,
  },
  STREETS: {
    ADD: `${STREET}/add`,
    UPDATE: `${STREET}/update`,
    DELETE: `${STREET}/delete`,
    GET_BY_ID: `${STREET}/get-by-id`,
    GET_ALL_ACTIVE: `${STREET}/get-all-active`,
    PAGINATION_SEARCH: `${STREET}/pagination-and-search`,
  },
  ZONES: {
    ADD: `${ZONE}/add`,
    UPDATE: `${ZONE}/update`,
    DELETE: `${ZONE}/delete`,
    GET_BY_ID: `${ZONE}/get-by-id`,
    GET_ALL_ACTIVE: `${ZONE}/get-all-active`,
    PAGINATION_SEARCH: `${ZONE}/pagination-and-search`,
  },
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
