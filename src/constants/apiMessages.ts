export const API_MESSAGES = {
  USER: {
    ALREADY_EXISTS: 'User with email already exists.',
    CREATED: 'User created successfully.',
    NOT_FOUND_WITH_EMAIL: 'User with email does not exists.',
    PROFILE_FETCHED: 'User profile fetched successfully.',
  },
  AUTHENTICATION: {
    INVALID_PASSWORD: 'Invalid Password.',
    LOGIN_SUCCESSFULL: 'Login Successfull.',
    SESSION_CONFLICT: 'You are already logged in on these devices. Please log out from one device first.',
    SESSION_REMOVED: 'Session deleted successfully.',
  },
} as const;
