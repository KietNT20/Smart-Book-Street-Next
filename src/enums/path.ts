export enum PATH {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  UNAUTHORIZED = '/unauthorized',

  DASHBOARD = '/dashboard',
  STATISTICS = '/statistics',

  // ADMIN
  PUBLISHERS = '/admin/publishers',
  PUBLISHER_CREATE = '/admin/publishers/create',

  STORES = '/admin/stores',
  STORE_CREATE = '/admin/stores/create',

  ADMIN_BOOKS = '/admin/books',
  ADMIN_BOOK_CREATE = '/admin/books/create',

  ADMIN_AUTHORS = '/admin/authors',
  ADMIN_AUTHOR_CREATE = '/admin/authors/create',

  EVENTS = '/admin/events',
  EVENT_CREATE = '/admin/events/create',
  CALENDAR_EVENT = '/admin/events/calendar',

  VISITOR_STATISTICS = '/admin/visitors/statistics',
  VISITOR_PREDICTION = '/admin/visitors/prediction',
  VISITOR_RECOMMENDATION = '/admin/visitors/recommendation',

  USERS = '/admin/users',
  USER_CREATE = '/admin/users/create',
  ROLES = '/admin/roles',

  // PUBLISHER MANAGER

  CATEGORIES = '/publisher/categories',
  CATEGORY_CREATE = '/publisher/categories/create',

  INVENTORY = '/publisher/inventory',

  PUBLISHER_BOOKS = '/publisher/books',

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
