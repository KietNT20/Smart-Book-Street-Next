import { RoleEnums } from '@/enums/role-enums';
import 'next-auth';
import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    expires: Date & string;
    accessToken: string;
    user: {
      userName: string;
    } & DefaultSession['user'];
  }

  interface User {
    userName: string;
    expiration: Date & string;
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
    expiration: Date & string;
    accessToken: string;
    userRoles: {
      role: {
        roleName: RoleEnums;
      };
    }[];
  }
}
