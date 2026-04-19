import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {
  Button,
  ImagePickerField,
  Input,
  Rating,
  Screen,
  Stack,
  Text,
} from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { saveRecord } from '../../src/lib/records';

function todayYMD() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function NewRecordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(todayYMD());
  const [memo, setMemo] = useState('');
  const [dateError, setDateError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setImageUri(null);
    setRating(0);
    setDate(todayYMD());
    setMemo('');
    setDateError(undefined);
  };

  const handleSave = async () => {
    if (!DATE_PATTERN.test(date)) {
      setDateError('YYYY-MM-DD 形式で入力してください');
      return;
    }
    setDateError(undefined);
    setSaving(true);
    try {
      await saveRecord({ imageUri, rating, date, memo });
      resetForm();
      router.navigate('/');
    } catch (e) {
      Alert.alert('保存に失敗しました', e instanceof Error ? e.message : '不明なエラー');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingVertical: theme.spacing['2xl'] }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Stack gap="2xl">
            <Stack gap="xs">
              <Text variant="displayMd">記録する</Text>
              <Text variant="bodyMd" color="secondary">
                今日飲んだ一献を書き留めましょう
              </Text>
            </Stack>

            <ImagePickerField label="写真" value={imageUri} onChange={setImageUri} />

            <Stack gap="sm">
              <Text variant="labelMd" color="secondary">
                評価
              </Text>
              <Rating value={rating} onChange={setRating} size={32} />
              <Text variant="bodyMd" color="muted">
                {rating === 0 ? '未評価' : `${rating} / 5`}
              </Text>
            </Stack>

            <Input
              label="飲んだ日"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={(v) => {
                setDate(v);
                if (dateError) setDateError(undefined);
              }}
              errorText={dateError}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
            />

            <Input
              label="メモ"
              placeholder="香り、口当たり、合わせた料理など"
              value={memo}
              onChangeText={setMemo}
              multiline
            />

            <Button
              label="保存"
              onPress={handleSave}
              fullWidth
              size="lg"
              loading={saving}
            />
          </Stack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
