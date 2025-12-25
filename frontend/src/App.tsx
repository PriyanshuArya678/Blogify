import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';

const AppContent = () => {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme.muiTheme.mode,
      primary: {
        main: theme.muiTheme.primary,
      },
      secondary: {
        main: theme.muiTheme.secondary,
      },
      background: {
        default: theme.colors.background,
        paper: theme.colors.surface,
      },
      text: {
        primary: theme.colors.text,
        secondary: theme.colors.textSecondary,
      },
    },
  });

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <AppRouter />
      </Router>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
