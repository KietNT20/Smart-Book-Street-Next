import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { API_ENDPOINT } from './constant/api-url';
import { PATH } from './constant/path';
import { LoginResponse } from './types/auth.types';
import axiosInstance from './utils/axiosInstance';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await axiosInstance.post<LoginResponse>(
            `${API_ENDPOINT.USERS.LOGIN}`,
            credentials
          );

          const data = response?.data;
          console.log('data', data);

          if (data?.isSuccess && data?.token) {
            return {
              id: data?.result.id,
              fullName: data?.result.fullName,
              email: data?.result.email,
              userName: data?.result.userName,
              accessToken: data?.token,
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
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      // console.log('token session', token);
      session.user.id = token.id;
      session.user.name = token.fullName;
      session.user.userName = token.userName;
      session.user.accessToken = token.accessToken;
      // console.log('session', session);
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
