import { RoleEnums } from '@/enums/role';
import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    userName: string;
    access_token: string | undefined;
    userRoles: {
      role: RoleEnums;
    }[];
  }
  interface Session extends DefaultSession {
    userId: string;
    access_token: string | undefined;
    user: {
      credential?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userName: string;
    fullName: string;
    access_token: string | undefined;
    userRoles: {
      role: RoleEnums;
    }[];
  }
}
