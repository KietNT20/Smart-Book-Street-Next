import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      userName: string;
    } & DefaultSession['user'];
  }

  interface User {
    userName: string;
    token: string;
    expiration: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userName: string;
    fullName: string;
    token: string;
    expiration: string;
  }
}
