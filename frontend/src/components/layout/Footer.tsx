import { Box, Typography, Container } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <Box
      component="footer"
      className="mt-auto py-6"
      sx={{
        backgroundColor: theme.colors.surface,
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{
            color: theme.colors.textSecondary,
          }}
        >
          © {new Date().getFullYear()} Blogify. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

