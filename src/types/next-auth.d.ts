import { RoleEnums } from '@/enums/role-enums';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    expires: Date | string;
    accessToken: string;
    user: {
      userName: string;
    } & DefaultSession['user'];
  }

  interface User {
    userName: string;
    expires_at: number;
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
    exp: number;
    accessToken: string;
    userRoles: {
      role: {
        roleName: RoleEnums;
      };
    }[];
  }
}
