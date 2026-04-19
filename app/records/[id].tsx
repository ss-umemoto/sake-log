import { Stack as RouterStack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Button, Card, Rating, Screen, Stack, Text } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { deleteRecord, getRecord, type SakeRecord } from '../../src/lib/records';

export default function RecordDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [record, setRecord] = useState<SakeRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!id) {
        setLoaded(true);
        return;
      }
      getRecord(id).then((r) => {
        if (active) {
          setRecord(r);
          setLoaded(true);
        }
      });
      return () => {
        active = false;
      };
    }, [id]),
  );

  const handleDelete = () => {
    if (!record) return;
    Alert.alert('削除しますか？', 'この記録を削除します。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deleteRecord(record.id);
          router.back();
        },
      },
    ]);
  };

  if (!loaded) {
    return (
      <Screen>
        <RouterStack.Screen options={{ title: '記録の詳細' }} />
      </Screen>
    );
  }

  if (!record) {
    return (
      <Screen>
        <RouterStack.Screen options={{ title: '記録の詳細' }} />
        <View style={{ paddingTop: theme.spacing['2xl'] }}>
          <Card variant="outlined">
            <Stack gap="sm" align="flex-start">
              <Text variant="titleMd">記録が見つかりません</Text>
              <Text variant="bodyMd" color="secondary">
                削除された可能性があります。
              </Text>
              <Button label="一覧に戻る" variant="outline" onPress={() => router.back()} />
            </Stack>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <RouterStack.Screen options={{ title: record.date }} />
      <ScrollView
        contentContainerStyle={{ paddingVertical: theme.spacing['2xl'] }}
        showsVerticalScrollIndicator={false}
      >
        <Stack gap="2xl">
          {record.imageUri ? (
            <Image
              source={{ uri: record.imageUri }}
              style={{
                width: '100%',
                aspectRatio: 4 / 5,
                borderRadius: theme.radius['2xl'],
                backgroundColor: theme.colors.surfaceAlt,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                aspectRatio: 4 / 5,
                borderRadius: theme.radius['2xl'],
                backgroundColor: theme.colors.primarySoft,
              }}
            />
          )}

          <Stack gap="md">
            <Stack gap="xs">
              <Text variant="labelMd" color="secondary">
                飲んだ日
              </Text>
              <Text variant="displayMd">{record.date}</Text>
            </Stack>

            <Stack gap="xs">
              <Text variant="labelMd" color="secondary">
                評価
              </Text>
              <Rating value={record.rating} size={28} />
              <Text variant="bodyMd" color="muted">
                {record.rating === 0 ? '未評価' : `${record.rating} / 5`}
              </Text>
            </Stack>

            <Stack gap="xs">
              <Text variant="labelMd" color="secondary">
                メモ
              </Text>
              <Card variant="outlined">
                <Text variant="bodyLg">{record.memo || 'メモなし'}</Text>
              </Card>
            </Stack>
          </Stack>

          <Button
            label="この記録を削除"
            variant="outline"
            onPress={handleDelete}
            fullWidth
          />
        </Stack>
      </ScrollView>
    </Screen>
  );
}
