import { STORAGE } from '@/constant/storage';
import Cookies from 'js-cookie';

type TokenTypes = {
  accessToken: string;
  refreshToken?: string;
};

type TokenMethodType = {
  get: () => TokenTypes | null;
  set: (token: TokenTypes) => void;
  remove: () => void;
};

// Local storage
export const localToken: TokenMethodType = {
  get: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(STORAGE.token);
    return token ? JSON.parse(token) : null;
  },
  set: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE.token, JSON.stringify(token));
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE.token);
    }
  }
};

// Cookies
export const cookieToken: TokenMethodType = {
  get: () => {
    const tokenStr = Cookies.get(STORAGE.token);
    if (!tokenStr) return null;

    try {
      return JSON.parse(tokenStr);
    } catch (error) {
      console.error('Error parsing token from cookie:', error);
      return null;
    }
  },
  set: (token) => {
    Cookies.set(STORAGE.token, JSON.stringify(token), {
      expires: 7, // 7 days expiration
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' // CSRF protection
    });
  },
  remove: () => Cookies.remove(STORAGE.token)
};

const tokenMethod: TokenMethodType = {
  get: () => {
    return cookieToken.get();
  },
  set: (token) => {
    console.log('Setting token', token);
    cookieToken.set(token);
  },
  remove: () => {
    cookieToken.remove();
  }
};

export default tokenMethod;
