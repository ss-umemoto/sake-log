import { View, type ViewProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { SpacingToken } from '../theme/spacing';

type Props = ViewProps & {
  direction?: 'row' | 'column';
  gap?: SpacingToken;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
};

export function Stack({
  direction = 'column',
  gap,
  align,
  justify,
  style,
  ...rest
}: Props) {
  const theme = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          flexDirection: direction,
          gap: gap ? theme.spacing[gap] : undefined,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    />
  );
}
