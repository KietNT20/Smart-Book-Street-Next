import NextAuth, { type Session } from 'next-auth';
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
          const response = await axiosInstance.post(
            `${API_ENDPOINT.USERS.LOGIN}`,
            credentials
          );

          const data: LoginResponse = await response.data;

          if (data.isSuccess && data.token) {
            return {
              id: data.result.id,
              name: data.result.fullName,
              email: data.result.email,
              username: data.result.userName,
              roles: (data.result.userRoles ?? []).map((role) => role.roleId),
              accessToken: data.token,
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
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      } as Session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
