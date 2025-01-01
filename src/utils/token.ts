import { STORAGE } from '@/constant/storage';
import { cookies } from 'next/headers';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

type TokenType = {
  get: () => TokenData;
  set: (token: TokenData) => void;
  remove: () => void;
};

const cookieStore = cookies();

// LocalStorage
// const localToken: TokenType = {
//   get: () => JSON.parse(localStorage.getItem(STORAGE.token) || '{}'),
//   set: (token) => localStorage.setItem(STORAGE.token, JSON.stringify(token)),
//   remove: () => localStorage.removeItem(STORAGE.token),
// };

// Cookies
const cookieToken: TokenType = {
  get: () =>
    JSON.parse(
      cookieStore.get(STORAGE.token)
        ? cookieStore.get(STORAGE.token)!.value
        : '{}'
    ),

  set: (token) => {
    cookieStore.set(STORAGE.token, JSON.stringify(token), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  },

  remove: () => {
    cookieStore.delete(STORAGE.token);
  },
};

const tokenMethod: TokenType = {
  get: () => {
    // return localToken.get();
    return cookieToken.get();
  },
  set: (token) => {
    console.log('token', token);
    // localToken.set(token);
    cookieToken.set(token);
  },
  remove: () => {
    // localToken.remove();
    cookieToken.remove();
  },
};

export default tokenMethod;
