import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

export type ImagePickerFieldProps = {
  label?: string;
  value?: string | null;
  onChange: (uri: string | null) => void;
};

export function ImagePickerField({ label, value, onChange }: ImagePickerFieldProps) {
  const theme = useTheme();

  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('権限が必要です', '写真ライブラリへのアクセスを許可してください。');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View>
      {label ? (
        <Text variant="labelMd" color="secondary" style={{ marginBottom: theme.spacing.xs }}>
          {label}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? '写真を変更' : '写真を追加'}
        onPress={pick}
        style={({ pressed }) => ({
          borderRadius: theme.radius.xl,
          borderWidth: value ? 0 : 1,
          borderStyle: 'dashed',
          borderColor: theme.colors.border,
          backgroundColor: value ? 'transparent' : theme.colors.surfaceAlt,
          height: 220,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        {value ? (
          <>
            <Image
              source={{ uri: value }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                right: theme.spacing.md,
                bottom: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs,
                backgroundColor: 'rgba(19, 14, 9, 0.7)',
                borderRadius: theme.radius.full,
              }}
            >
              <Text variant="labelMd" color="inverse">
                変更
              </Text>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
            <Text variant="displayMd" color="muted">
              +
            </Text>
            <Text variant="bodyMd" color="muted">
              タップして写真を追加
            </Text>
          </View>
        )}
      </Pressable>
      {value ? (
        <Pressable
          onPress={() => onChange(null)}
          accessibilityRole="button"
          style={{ marginTop: theme.spacing.xs, alignSelf: 'flex-start' }}
        >
          <Text variant="labelMd" color="danger">
            写真を削除
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
