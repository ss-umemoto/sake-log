import { Pressable, View, type PressableProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type ChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  selected?: boolean;
};

export function Chip({ label, selected = false, disabled, ...rest }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      {...rest}
    >
      {({ pressed }) => (
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.radius.full,
            borderWidth: 1,
            borderColor: selected ? theme.colors.primary : theme.colors.border,
            backgroundColor: selected
              ? theme.colors.primarySoft
              : pressed
                ? theme.colors.surfaceAlt
                : 'transparent',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Text
            variant="labelMd"
            color={selected ? 'accent' : 'secondary'}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
