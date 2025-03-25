import { STORAGE } from '@/constant/storage';

type TokenTypes = {
  accessToken: string;
  refreshToken?: string;
};

type TokenMethodType = {
  get: () => TokenTypes;
  set: (token: TokenTypes) => void;
  remove: () => void;
};

const localToken: TokenMethodType = {
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

const tokenMethod: TokenMethodType = {
  get: () => localToken.get(),
  set: (token) => {
    console.log('token', token);
    localToken.set(token);
  },
  remove: () => localToken.remove()
};

export default tokenMethod;
