type RegexType = {
  SPECIAL_CHAR: RegExp;
  PHONE_VN: RegExp;
  EMAIL: RegExp;
  USERNAME: RegExp;
};

export const REGEX: RegexType = {
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?/]/,
  // Regex số điện thoại Việt Nam (di động, cố định, cơ quan)
  PHONE_VN:
    /^(?:(?:\+|00)84|0)(?:(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])\d{7}|(?:2\d)\d{8}|(?:80)\d{7}|8\d{7}|8\d{6})$/,

  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{2,16}$/,
};
