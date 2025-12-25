import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Login, PersonAdd, Create, AccountCircle, Palette, Logout } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { ThemeName } from '../../theme/themes';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { themeName, setTheme, theme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (location.pathname === '/create' || location.pathname.startsWith('/profile/')) {
      navigate('/');
    }
  };

  const navItems = isAuthenticated
    ? [
        { label: 'Home', path: '/', icon: <Home /> },
        { label: 'Create', path: '/create', icon: <Create /> },
        { label: 'Profile', path: `/profile/${user?.id}`, icon: <AccountCircle /> },
      ]
    : [
        { label: 'Home', path: '/', icon: <Home /> },
        { label: 'Login', path: '/login', icon: <Login /> },
        { label: 'Register', path: '/register', icon: <PersonAdd /> },
      ];

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.colors.primary }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Blogify
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              variant="text"
              sx={{
                ...(location.pathname === item.path && {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }),
              }}
            >
              {item.label}
            </Button>
          ))}
          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<Logout />}
              variant="text"
            >
              Logout
            </Button>
          )}
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
                padding: '8px 14px',
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
            }}
          >
            <InputLabel sx={{ color: 'white !important' }}>Theme</InputLabel>
            <Select
              value={themeName}
              onChange={(e) => setTheme(e.target.value as ThemeName)}
              label="Theme"
              startAdornment={<Palette sx={{ mr: 1, color: 'white' }} />}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="blue">Blue</MenuItem>
              <MenuItem value="minimal">Minimal</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

