export interface LoginResponse {
  result: {
    userName: string;
    email: string;
    fullName: string;
    id: string;
    userRoles?: {
      userId: string;
      roleId: string;
    }[];
    // Add other fields as needed
  };
  token: string;
  expiration: string;
  isSuccess: boolean;
  message: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}
