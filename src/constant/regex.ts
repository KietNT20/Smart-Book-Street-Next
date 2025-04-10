type RegexType = {
  SPECIAL_CHAR: RegExp;
  PHONE_VN: RegExp;
  EMAIL: RegExp;
  USERNAME: RegExp;
};

export const REGEX: RegexType = {
  SPECIAL_CHAR: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?/]/,
  PHONE_VN: /^((\+84)|0)(3|5|7|8|9)([0-9]{8,9})$/,
  EMAIL: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
  USERNAME: /^[a-zA-Z0-9_-]{2,16}$/,
};
