import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, themes } from './themes';

interface ThemeContextType {
  themeName: ThemeName;
  theme: typeof themes.light;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const applyTheme = (name: ThemeName) => {
    const theme = themes[name];
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-accent', theme.colors.accent);
  };

  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    applyTheme(name);
  };

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: themes[themeName],
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

