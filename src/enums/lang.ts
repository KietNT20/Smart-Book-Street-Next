export enum Language {
  VIETNAMESE = 'vi',
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  SPANISH = 'es',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  RUSSIAN = 'ru',
  PORTUGUESE = 'pt',
  ITALIAN = 'it',
  ARABIC = 'ar',
  HINDI = 'hi',
  THAI = 'th'
}

export const LanguageLabels: Record<Language, string> = {
  [Language.VIETNAMESE]: 'Tiếng Việt (Vietnamese)',
  [Language.ENGLISH]: 'English',
  [Language.FRENCH]: 'Français',
  [Language.GERMAN]: 'Deutsch',
  [Language.SPANISH]: 'Español',
  [Language.CHINESE]: '中文 (Chinese)',
  [Language.JAPANESE]: '日本語 (Japanese)',
  [Language.KOREAN]: '한국어 (Korean)',
  [Language.RUSSIAN]: 'Русский',
  [Language.PORTUGUESE]: 'Português',
  [Language.ITALIAN]: 'Italiano',
  [Language.ARABIC]: 'العربية (Arabic)',
  [Language.HINDI]: 'हिन्दी (Hindi)',
  [Language.THAI]: 'ไทย (Thai)'
};

//  (Optional) Vietnamese language labels for the languages
export const VietnameseLanguageLabels: Record<Language, string> = {
  [Language.VIETNAMESE]: 'Tiếng Việt',
  [Language.ENGLISH]: 'Tiếng Anh',
  [Language.FRENCH]: 'Tiếng Pháp',
  [Language.GERMAN]: 'Tiếng Đức',
  [Language.SPANISH]: 'Tiếng Tây Ban Nha',
  [Language.CHINESE]: 'Tiếng Trung',
  [Language.JAPANESE]: 'Tiếng Nhật',
  [Language.KOREAN]: 'Tiếng Hàn',
  [Language.RUSSIAN]: 'Tiếng Nga',
  [Language.PORTUGUESE]: 'Tiếng Bồ Đào Nha',
  [Language.ITALIAN]: 'Tiếng Ý',
  [Language.ARABIC]: 'Tiếng Ả Rập',
  [Language.HINDI]: 'Tiếng Hindi',
  [Language.THAI]: 'Tiếng Thái'
};
