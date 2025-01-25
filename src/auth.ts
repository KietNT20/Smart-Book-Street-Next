import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PATH } from './constant/path';
import { userService } from './services/userService';
import { LoginCredentials, UserRoles } from './types/auth.types';
import tokenMethod from './utils/token';

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
            const expiresAt = new Date(data.expiration).getTime() / 1000;
            tokenMethod.set(data.token);
            return {
              id: data?.result.id,
              fullName: data?.result.fullName,
              email: data?.result.email,
              userName: data?.result.userName,
              token: data?.token,
              expires_at: expiresAt,
              userRoles: data?.result.userRoles.map(
                (role: UserRoles) => role.role.roleName
              ),
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
        token.exp = user.expires_at;
        token.userRoles = user.userRoles;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.sub as string;
      session.user.userName = token.userName;
      session.user.userRoles = token.userRoles;
      session.accessToken = token.accessToken;
      session.expires = new Date(token.exp * 1000);
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    },
  },
});
