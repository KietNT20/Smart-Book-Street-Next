import { STORAGE } from "@/constant/storage";

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

type localTokenType = {
  get: () => TokenData;
  set: (token: TokenData) => void;
  remove: () => void;
};
// LocalStorage
const localToken: localTokenType = {
  get: () => JSON.parse(localStorage.getItem(STORAGE.token) || "{}"),
  set: (token) => localStorage.setItem(STORAGE.token, JSON.stringify(token)),
  remove: () => localStorage.removeItem(STORAGE.token),
};

// Cookies
// export const cookieToken = {
//     get: () =>
//         JSON.parse(
//             Cookies.get(STORAGE.token) !== undefined
//                 ? Cookies.get(STORAGE.token)
//                 : null,
//         ),
//     set: (token) => Cookies.set(STORAGE.token, JSON.stringify(token)),
//     remove: () => Cookies.remove(STORAGE.token),
// };

const tokenMethod: localTokenType = {
  get: () => {
    return localToken.get();
    // return cookieToken.get();
  },
  set: (token) => {
    console.log("token", token);
    localToken.set(token);
    // cookieToken.set(token);
  },
  remove: (): void => {
    localToken.remove();
    // cookieToken.remove();
  },
};

export default tokenMethod;
