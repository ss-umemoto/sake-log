import type { TextStyle } from 'react-native';

export const fontFamilies = {
  headline: 'Newsreader_600SemiBold',
  headlineRegular: 'Newsreader_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  label: 'Inter_500Medium',
} as const;

export type TypographyVariant =
  | 'displayLg'
  | 'displayMd'
  | 'titleLg'
  | 'titleMd'
  | 'bodyLg'
  | 'bodyMd'
  | 'labelMd'
  | 'labelSm';

export const typography: Record<TypographyVariant, TextStyle> = {
  displayLg: {
    fontFamily: fontFamilies.headline,
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  displayMd: {
    fontFamily: fontFamilies.headline,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  titleLg: {
    fontFamily: fontFamilies.headline,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMd: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyLg: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: fontFamilies.label,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontFamily: fontFamilies.label,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
};
