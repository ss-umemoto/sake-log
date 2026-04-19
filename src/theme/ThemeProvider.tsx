import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme, type ThemeMode } from './theme';

type ThemeContextValue = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode | 'system') => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  children: ReactNode;
  initialMode?: ThemeMode | 'system';
};

export function ThemeProvider({ children, initialMode = 'system' }: Props) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ThemeMode | 'system'>(initialMode);

  const value = useMemo<ThemeContextValue>(() => {
    const resolved: ThemeMode =
      override === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : override;
    return {
      theme: resolved === 'dark' ? darkTheme : lightTheme,
      mode: resolved,
      setMode: setOverride,
    };
  }, [override, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx.theme;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside <ThemeProvider>');
  return { mode: ctx.mode, setMode: ctx.setMode };
}
