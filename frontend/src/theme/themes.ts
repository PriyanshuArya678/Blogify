export type ThemeName = 'light' | 'dark' | 'blue' | 'minimal';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
  muiTheme: {
    mode: 'light' | 'dark';
    primary: string;
    secondary: string;
  };
}

export const themes: Record<ThemeName, ThemeConfig> = {
  light: {
    name: 'light',
    displayName: 'Light',
    colors: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
      accent: '#1976d2',
    },
    muiTheme: {
      mode: 'light',
      primary: '#1976d2',
      secondary: '#dc004e',
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    colors: {
      primary: '#90caf9',
      secondary: '#f48fb1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#333333',
      accent: '#90caf9',
    },
    muiTheme: {
      mode: 'dark',
      primary: '#90caf9',
      secondary: '#f48fb1',
    },
  },
  blue: {
    name: 'blue',
    displayName: 'Blue',
    colors: {
      primary: '#1565c0',
      secondary: '#0277bd',
      background: '#e3f2fd',
      surface: '#bbdefb',
      text: '#0d47a1',
      textSecondary: '#1565c0',
      border: '#90caf9',
      accent: '#1565c0',
    },
    muiTheme: {
      mode: 'light',
      primary: '#1565c0',
      secondary: '#0277bd',
    },
  },
  minimal: {
    name: 'minimal',
    displayName: 'Minimal',
    colors: {
      primary: '#424242',
      secondary: '#616161',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
      accent: '#424242',
    },
    muiTheme: {
      mode: 'light',
      primary: '#424242',
      secondary: '#616161',
    },
  },
};

