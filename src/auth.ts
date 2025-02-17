import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { API_ENDPOINT } from './constant/api-url';
import { PATH } from './enums/path';
import { LoginCredentials, UserRoles } from './types/auth-types';

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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/${API_ENDPOINT.USERS.LOGIN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials as LoginCredentials),
            }
          );

          const data = await res.json();

          if (!data) return null;

          return {
            id: data.result.id,
            fullName: data.result.fullName,
            email: data.result.email,
            userName: data.result.userName,
            token: data.token,
            userRoles: data.result.userRoles.map(
              (role: UserRoles) => role.role?.roleName
            ),
          };
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
    jwt({ token, user, account }) {
      console.log('account', account);
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
