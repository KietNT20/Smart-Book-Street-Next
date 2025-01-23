import { RoleEnums } from '@/enums/role-enums';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    expires: Date | string;
    user: {
      userName: string;
    } & DefaultSession['user'];
  }

  interface User {
    userName: string;
    token: string;
    expires_at: number;
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
    token: string;
    exp: number;
    userRoles: {
      role: {
        roleName: RoleEnums;
      };
    }[];
  }
}
