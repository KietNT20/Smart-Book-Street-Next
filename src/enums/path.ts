export enum PATH {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  UNAUTHORIZED = '/unauthorized',

  DASHBOARD = '/dashboard',
  STATISTICS = '/statistics',

  // ADMIN
  PUBLISHERS = '/publishers',
  PUBLISHER_CREATE = '/publishers/create',

  STORES = '/stores',
  STORE_CREATE = '/stores/create',

  ADMIN_BOOKS = '/books',
  ADMIN_BOOK_CREATE = '/books/create',

  ADMIN_AUTHORS = '/authors',
  ADMIN_AUTHOR_CREATE = '/authors/create',

  EVENTS = '/events',
  EVENT_CREATE = '/events/create',
  CALENDAR_EVENT = '/events/calendar',

  ZONES = '/zones',

  VISITOR_STATISTICS = '/visitors/statistics',
  VISITOR_PREDICTION = '/visitors/prediction',
  VISITOR_RECOMMENDATION = '/visitors/recommendation',

  USERS = '/users',
  USER_CREATE = '/users/create',
  ROLES = '/roles',

  // PUBLISHER MANAGER
  CATEGORIES = '/categories',
  CATEGORY_CREATE = '/categories/create',

  INVENTORY = '/inventory',

  // STORE MANAGER

  STORE_BOOKS = '/store/books',

  STORE_HOURS = '/store/hours',
  STORE_HOURS_EDIT = '/store/hours/edit',

  PROFILE = '/profile',
  PROFILE_EDIT = '/profile/edit',
  CHANGE_PASSWORD = '/profile/change-password',

  SETTINGS = '/settings',
  NOTIFICATIONS = '/notifications'
}
