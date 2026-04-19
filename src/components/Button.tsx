import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type Variant = 'filled' | 'tonal' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'filled',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  const sizing = useMemo(() => {
    switch (size) {
      case 'sm':
        return { paddingV: theme.spacing.sm, paddingH: theme.spacing.lg, minHeight: 36 };
      case 'lg':
        return { paddingV: theme.spacing.lg, paddingH: theme.spacing['2xl'], minHeight: 56 };
      default:
        return { paddingV: theme.spacing.md, paddingH: theme.spacing.xl, minHeight: 48 };
    }
  }, [size, theme.spacing]);

  const palette = useMemo(() => {
    switch (variant) {
      case 'tonal':
        return {
          bg: theme.colors.primarySoft,
          bgPressed: theme.colors.accent,
          border: 'transparent',
          text: theme.colors.onPrimarySoft,
        };
      case 'outline':
        return {
          bg: 'transparent',
          bgPressed: theme.colors.primarySoft,
          border: theme.colors.border,
          text: theme.colors.textPrimary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          bgPressed: theme.colors.surfaceAlt,
          border: 'transparent',
          text: theme.colors.textPrimary,
        };
      default:
        return {
          bg: theme.colors.primary,
          bgPressed: theme.colors.primaryPressed,
          border: 'transparent',
          text: theme.colors.onPrimary,
        };
    }
  }, [variant, theme.colors]);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          paddingVertical: sizing.paddingV,
          paddingHorizontal: sizing.paddingH,
          minHeight: sizing.minHeight,
          borderRadius: theme.radius.xl,
          borderColor: palette.border,
          borderWidth: variant === 'outline' ? 1 : 0,
          backgroundColor: pressed && !isDisabled ? palette.bgPressed : palette.bg,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={{ marginRight: theme.spacing.sm }}>{leftIcon}</View> : null}
          <Text
            variant={size === 'sm' ? 'labelMd' : 'titleMd'}
            style={{ color: palette.text }}
          >
            {label}
          </Text>
          {rightIcon ? <View style={{ marginLeft: theme.spacing.sm }}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
