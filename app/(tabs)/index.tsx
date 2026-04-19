import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { Card, Rating, Screen, Stack, Text } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { listRecords, type SakeRecord } from '../../src/lib/records';

export default function RecordListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [records, setRecords] = useState<SakeRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listRecords().then((r) => {
        if (active) {
          setRecords(r);
          setLoaded(true);
        }
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen>
      <FlatList
        data={records}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{
          paddingVertical: theme.spacing['2xl'],
          gap: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Stack gap="xs" style={{ marginBottom: theme.spacing.lg }}>
            <Text variant="displayMd">一覧</Text>
            <Text variant="bodyMd" color="secondary">
              これまで記録した一献
            </Text>
          </Stack>
        }
        ListEmptyComponent={
          loaded ? (
            <Card variant="outlined">
              <Stack gap="sm" align="flex-start">
                <Text variant="titleMd">まだ記録がありません</Text>
                <Text variant="bodyMd" color="secondary">
                  「記録」タブから最初の一献を追加しましょう。
                </Text>
                <Link href="/new" asChild>
                  <Pressable>
                    <Text variant="labelMd" color="accent">
                      記録を追加する →
                    </Text>
                  </Pressable>
                </Link>
              </Stack>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/records/${item.id}`)}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Card>
              <Stack direction="row" gap="md" align="flex-start">
                {item.imageUri ? (
                  <Image
                    source={{ uri: item.imageUri }}
                    style={{
                      width: 72,
                      height: 90,
                      borderRadius: theme.radius.lg,
                      backgroundColor: theme.colors.surfaceAlt,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 72,
                      height: 90,
                      borderRadius: theme.radius.lg,
                      backgroundColor: theme.colors.primarySoft,
                    }}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text variant="titleMd" numberOfLines={1}>
                    {item.name || '銘柄未設定'}
                  </Text>
                  <Text variant="labelMd" color="muted">
                    {item.date}
                  </Text>
                  <View style={{ marginVertical: theme.spacing.xs }}>
                    <Rating value={item.rating} size={16} />
                  </View>
                  <Text variant="bodyMd" color="secondary" numberOfLines={2}>
                    {item.memo || 'メモなし'}
                  </Text>
                </View>
              </Stack>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}
