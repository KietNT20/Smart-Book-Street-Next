import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { API_ENDPOINT } from './constant/api-url';
import { PATH } from './enums/path';
import { UserRoles } from './types/auth-types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    Credentials({
      credentials: {
        usernameOrEmail: {},
        password: {}
      },
      authorize: async (credentials) => {
        const { usernameOrEmail, password } = credentials;

        if (!usernameOrEmail || !password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINT.USERS.LOGIN}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({ usernameOrEmail, password })
            }
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error('API error response:', errorText);
            throw new Error(`Login failed: ${res.status} ${res.statusText}`);
          }

          let data;
          try {
            data = await res.json();
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response text:', await res.text());
            throw new Error('Invalid response format from server');
          }

          const user: User = {
            id: data.result.id,
            email: data.result.email,
            userName: data.result.userName,
            access_token: data.token,
            userRoles: data.result.userRoles.map((userRole: UserRoles) => {
              if (!userRole.role || !userRole.role.roleName) {
                throw new Error('Missing roleName for a user role');
              }
              return { role: userRole.role.roleName };
            })
          };

          return user;
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: PATH.LOGIN
  },
  session: {
    strategy: 'jwt'
    // maxAge: 4.5 * 60 * 60 // 4 hours 30 minutes,
  },
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.userName = user.userName;
        token.userRoles = user.userRoles;
        token.access_token = user.access_token;
      }
      if (account?.provider === 'google') {
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token
        };
      }
      return token;
    },
    session({ session, token }) {
      session.userId = token.sub as string;
      session.user.credential = token.id_token as string;
      session.user.userName = token.userName;
      session.user.userRoles = token.userRoles;
      session.access_token = token.access_token;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated,
      //otherwise redirect to login page
      return !!auth;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET
});
