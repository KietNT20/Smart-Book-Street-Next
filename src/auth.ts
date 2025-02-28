import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { API_ENDPOINT } from './constant/api-url';
import { PATH } from './enums/path';
import { loginSchema } from './lib/zod';
import { LoginResponse, UserRoles } from './types/auth-types';

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
        usernameOrEmail: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { usernameOrEmail, password } = credentials;

        if (!usernameOrEmail || !password) {
          return null;
        }

        try {
          const payloadLogin = await loginSchema.parseAsync({
            usernameOrEmail,
            password,
          });
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINT.USERS.LOGIN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payloadLogin),
            }
          );

          const data: LoginResponse = await res.json();

          if (!res.ok) {
            throw new Error('Invalid credentials.');
          }

          const user: User = {
            id: data.result.id,
            email: data.result.email,
            userName: data.result.userName,
            token: data.token,
            userRoles: data.result.userRoles.map((userRole: UserRoles) => {
              if (!userRole.role || !userRole.role.roleName) {
                throw new Error('Missing roleName for a user role');
              }
              return { role: userRole.role.roleName };
            }),
          };

          return user;
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: PATH.LOGIN,
  },
  session: {
    strategy: 'jwt',
    maxAge: 4.5 * 60 * 60, // 4 hours 30 minutes,
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
