import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { TypographyVariant } from '../theme/typography';

type Color = 'primary' | 'secondary' | 'muted' | 'inverse' | 'accent' | 'danger';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: Color;
};

export function Text({
  variant = 'bodyMd',
  color = 'primary',
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const colorValue = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.textMuted,
    inverse: theme.colors.textInverse,
    accent: theme.colors.primary,
    danger: theme.colors.danger,
  }[color];

  return (
    <RNText
      {...rest}
      style={[theme.typography[variant], { color: colorValue }, style]}
    />
  );
}
