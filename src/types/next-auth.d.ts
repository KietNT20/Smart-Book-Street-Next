import { RoleEnums } from '@/enums/role-enums';
import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      userName: string;
    } & DefaultSession['user'];
  }

  interface User {
    userName: string;
    token: string;
    userRoles: {
      role: {
        roleName: RoleEnums;
      };
    }[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userName: string;
    fullName: string;
    accessToken: string;
    userRoles: {
      role: {
        roleName: RoleEnums;
      };
    }[];
  }
}
