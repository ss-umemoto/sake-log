import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({
  label,
  helperText,
  errorText,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const hasError = !!errorText;

  const borderColor = hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="labelMd" color="secondary" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            borderColor,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.lg,
            minHeight: rest.multiline ? 120 : 48,
            alignItems: rest.multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.textMuted}
          textAlignVertical={rest.multiline ? 'top' : 'center'}
          style={[
            theme.typography.bodyLg,
            { color: theme.colors.textPrimary, flex: 1, paddingVertical: theme.spacing.md },
          ]}
        />
      </View>
      {hasError ? (
        <Text variant="labelMd" color="danger" style={{ marginTop: theme.spacing.xs }}>
          {errorText}
        </Text>
      ) : helperText ? (
        <Text variant="labelMd" color="muted" style={{ marginTop: theme.spacing.xs }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
