import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { API_ENDPOINT } from './constant/api-url';
import { BASE_URL } from './constant/environment';
import { PATH } from './enums/path';
import { loginSchema } from './lib/zod';
import { LoginCredentials, LoginResponse, UserRoles } from './types/auth-types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      credentials: {
        usernameOrEmail: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { usernameOrEmail, password } = credentials as LoginCredentials;

          const payloadLogin = await loginSchema.parseAsync({
            usernameOrEmail,
            password,
          });

          const res = await fetch(`${BASE_URL}/${API_ENDPOINT.USERS.LOGIN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadLogin),
          });

          const data: Awaited<LoginResponse> = await res.json();

          if (!res.ok) return null;

          const user: Awaited<User> = {
            id: data.result.id,
            email: data.result.email,
            userName: data.result.userName,
            token: data.token,
            userRoles: data.result.userRoles.map((role: UserRoles) => {
              if (!role.role || !role.role.roleName) {
                throw new Error('Missing roleName for a user role');
              }
              return { role: role.role.roleName };
            }),
          };

          return user;
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
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60 * 60, // 5 hours,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.userName = user.userName;
        token.userRoles = user.userRoles;
        token.accessToken = user.token;
      }
      return token;
    },
    session({ session, token }) {
      session.userId = token.sub as string;
      session.user.userName = token.userName;
      session.user.userRoles = token.userRoles;
      session.accessToken = token.accessToken;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
