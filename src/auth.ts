import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PATH } from './constant/path';
import { userService } from './services/userService';
import { LoginCredentials } from './types/auth.types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        usernameOrEmail: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await userService.login(
            credentials as LoginCredentials
          );
          const data = response?.data;

          if (data?.isSuccess && data?.token) {
            return {
              id: data?.result.id,
              fullName: data?.result.fullName,
              email: data?.result.email,
              userName: data?.result.userName,
              token: data?.token,
              expiration: data?.expiration,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: PATH.LOGIN,
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.userName = user.userName;
        token.token = user.token;
        token.expiration = user.expiration;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.sub as string;
      session.user.userName = token.userName;
      session.user.token = token.token;
      // session.expires = token.expiration;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
