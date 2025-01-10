import NextAuth, { CredentialsSignin, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PATH } from './constant/path';
import { LoginResponse } from './types/auth.types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        usernameOrEmail: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log('>>> credentials', credentials);
        const usernameOrEmail = credentials.usernameOrEmail as
          | string
          | undefined;
        const password = credentials.password as string | undefined;

        if (!usernameOrEmail || !password) {
          throw new CredentialsSignin('Please provide both email & password');
        }

        // Call your API endpoint to validate the user
        const res = await fetch('https://your-api-endpoint/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernameOrEmail, password }),
        });

        const data: LoginResponse = await res.json();

        if (data) {
          // Return user data if login is successful
          return {
            id: data.result.id,
            userName: data.result.userName,
            email: data.result.email,
            fullName: data.result.fullName,
          };
        }

        // Return null if login fails
        return null;
      },
    }),
  ],
  pages: {
    signIn: PATH.LOGIN,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        console.log('>>> user', user);
        // User is available during sign-in
        token.user = user as User;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
