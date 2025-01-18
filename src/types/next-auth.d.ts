import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      roles: string[];
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username: string;
    roles: string[];
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    roles: string[];
    accessToken: string;
  }
}
