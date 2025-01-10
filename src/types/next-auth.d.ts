import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    result: User;
    token: string;
    expiration: number;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    userName: string;
    email: string;
  }

  interface Session {
    user: User;
    token: string;
    expiration: number;
  }
}
