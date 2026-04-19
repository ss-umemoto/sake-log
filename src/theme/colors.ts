// Derived from the Sake Log Stitch design system
// (primary seed #C28840, expressive variant, warm amber tones).
export const palette = {
  amber50: '#FDF8F2',
  amber100: '#F7EBD7',
  amber200: '#EDD4A8',
  amber300: '#E0B873',
  amber400: '#D19E52',
  amber500: '#C28840',
  amber600: '#A46E2F',
  amber700: '#825523',
  amber800: '#5E3C18',
  amber900: '#3A250E',

  neutral0: '#FFFFFF',
  neutral50: '#FAF7F3',
  neutral100: '#F2EDE6',
  neutral200: '#E2DAD0',
  neutral300: '#C9BFB3',
  neutral400: '#9E9387',
  neutral500: '#766C61',
  neutral600: '#574E45',
  neutral700: '#3D352D',
  neutral800: '#271F19',
  neutral900: '#130E09',

  success: '#2F7D4F',
  warning: '#B5761F',
  danger: '#B3261E',
} as const;

export type ColorScheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  onPrimary: string;
  primarySoft: string;
  onPrimarySoft: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
};

export const lightColors: ColorScheme = {
  background: palette.amber50,
  surface: palette.neutral0,
  surfaceAlt: palette.neutral100,
  border: palette.neutral200,
  textPrimary: palette.neutral900,
  textSecondary: palette.neutral700,
  textMuted: palette.neutral500,
  textInverse: palette.neutral0,
  primary: palette.amber500,
  primaryHover: palette.amber600,
  primaryPressed: palette.amber700,
  onPrimary: palette.neutral0,
  primarySoft: palette.amber100,
  onPrimarySoft: palette.amber800,
  accent: palette.amber300,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
};

export const darkColors: ColorScheme = {
  background: palette.neutral900,
  surface: palette.neutral800,
  surfaceAlt: palette.neutral700,
  border: palette.neutral700,
  textPrimary: palette.amber50,
  textSecondary: palette.neutral200,
  textMuted: palette.neutral400,
  textInverse: palette.neutral900,
  primary: palette.amber400,
  primaryHover: palette.amber300,
  primaryPressed: palette.amber200,
  onPrimary: palette.neutral900,
  primarySoft: palette.amber800,
  onPrimarySoft: palette.amber100,
  accent: palette.amber300,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
};
