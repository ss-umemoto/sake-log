import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type RatingProps = {
  value: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
};

export function Rating({ value, max = 5, size = 20, onChange }: RatingProps) {
  const theme = useTheme();
  const readonly = !onChange;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        const star = (
          <Text
            style={{
              fontSize: size,
              lineHeight: size * 1.1,
              color: filled ? theme.colors.primary : theme.colors.border,
            }}
          >
            ★
          </Text>
        );
        return readonly ? (
          <View key={i}>{star}</View>
        ) : (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`${max}段階中 ${i + 1}`}
            onPress={() => onChange?.(i + 1)}
          >
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}
