import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import { UserRole } from './auth.types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userName: string;
      userRoles: UserRole[];
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    userName: string;
    userRoles: UserRole[];
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userName: string;
    fullName: string;
    userRoles: UserRole[];
    accessToken: string;
  }
}
