import { Role } from '@/constant/roles';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    token: string;
    expiration: number;
    isSuccess: boolean;
    message: string;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    dob: string;
    address: string;
    phone: string;
    gender: string;
    userRoles: Role[];
    [key: string]: any;
  }

  interface Session {
    user: User;
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error: string;
  }
}
