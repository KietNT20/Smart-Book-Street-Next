export enum PATH {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  UNAUTHORIZED = '/unauthorized',

  DASHBOARD = '/dashboard',
  STORE_OWNER_DASHBOARD = '/so-dashboard',
  STORE_MANAGER_DASHBOARD = '/sm-dashboard',
  STATISTICS = '/statistics',
  CHANGE_PASSWORD_FIRST_TIME = '/change-pass-first',

  EVENT_DATE = '/event-date',

  // ADMIN
  PUBLISHERS = '/publishers',
  PUBLISHER_CREATE = '/publishers/create',

  STORES = '/stores',
  STORE_CREATE = '/stores/create',

  BOOKS = '/books',
  BOOK_CREATE = '/books/create',

  ADMIN_AUTHORS = '/authors',
  ADMIN_AUTHOR_CREATE = '/authors/create',

  EVENT_CREATION_REQUEST = '/event-create-request',
  EVENTS = '/events',
  EVENT_CREATE = '/events/create',
  CALENDAR_EVENT = '/events/calendar',

  ZONES = '/zones',
  ZONE_CREATE = '/zones/create',

  VISITOR_STATISTICS = '/visitors/statistics',
  VISITOR_PREDICTION = '/visitors/prediction',
  VISITOR_RECOMMENDATION = '/visitors/recommendation',

  USERS = '/users',
  USER_CREATE = '/users/create',
  USER_STORES = '/userstores',
  ROLES = '/roles',

  // PUBLISHER MANAGER
  CATEGORIES = '/categories',

  INVENTORY = '/inventory',

  // STORE MANAGER

  STORE_HOURS = '/store-schedules',
  STORE_HOURS_EDIT = '/store-schedules/edit',

  ORDERS = '/orders',
  PACKAGES = '/packages',
  SOUVENIRS = '/souvenirs',
  SOUVENIR_CREATE = '/souvenirs/create',

  ACCOUNT = '/account',
  CHANGE_PASSWORD = '/account/change-password',

  SETTINGS = '/settings',
  NOTIFICATIONS = '/notifications',
}
