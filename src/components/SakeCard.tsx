import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Card } from './Card';
import { Rating } from './Rating';
import { Stack } from './Stack';
import { Text } from './Text';

export type SakeCardProps = {
  name: string;
  brewery: string;
  region: string;
  rating: number;
  thumbnailColor?: string;
  onPress?: () => void;
};

export function SakeCard({
  name,
  brewery,
  region,
  rating,
  thumbnailColor,
  onPress,
}: SakeCardProps) {
  const theme = useTheme();
  const body = (
    <Card>
      <Stack direction="row" gap="lg" align="center">
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: theme.radius.lg,
            backgroundColor: thumbnailColor ?? theme.colors.primarySoft,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text variant="titleMd" numberOfLines={1}>
            {name}
          </Text>
          <Text variant="bodyMd" color="secondary" numberOfLines={1}>
            {brewery} · {region}
          </Text>
          <View style={{ marginTop: theme.spacing.xs }}>
            <Rating value={rating} size={14} />
          </View>
        </View>
      </Stack>
    </Card>
  );

  if (!onPress) return body;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {body}
    </Pressable>
  );
}
