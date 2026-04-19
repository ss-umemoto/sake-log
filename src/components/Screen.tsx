import { SafeAreaView, View, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function Screen({ style, children, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        {...rest}
        style={[{ flex: 1, paddingHorizontal: theme.spacing['2xl'] }, style]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
