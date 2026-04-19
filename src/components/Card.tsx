import { View, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Variant = 'elevated' | 'outlined' | 'filled';

export type CardProps = ViewProps & {
  variant?: Variant;
  padding?: keyof ReturnType<typeof useTheme>['spacing'];
};

export function Card({
  variant = 'elevated',
  padding = 'lg',
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();

  const base = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius['2xl'],
    padding: theme.spacing[padding],
  };

  const variantStyle =
    variant === 'outlined'
      ? { borderWidth: 1, borderColor: theme.colors.border }
      : variant === 'filled'
        ? { backgroundColor: theme.colors.surfaceAlt }
        : theme.shadows.sm;

  return (
    <View {...rest} style={[base, variantStyle, style]}>
      {children}
    </View>
  );
}
