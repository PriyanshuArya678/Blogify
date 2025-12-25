import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Favorite, Comment, Person } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { blogsAPI } from '../services/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  categories: string[];
  tags: string[];
}

const Home = () => {
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogsAPI.getAll();
        setBlogs(response.data.data || []);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load blogs. Please check your connection and try again.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-center items-center min-h-[400px]">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ color: theme.colors.text, mb: 4 }}
      >
        All Blogs
      </Typography>

      {blogs.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ color: theme.colors.textSecondary }}>
            No blogs found. Be the first to create one!
          </Typography>
        </Paper>
      ) : (
        <Box className="space-y-4">
          {blogs.map((blog) => (
            <Card
              key={blog._id}
              component={Link}
              to={`/blogs/${blog._id}`}
              sx={{
                textDecoration: 'none',
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ color: theme.colors.text, mb: 2 }}
                >
                  {blog.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: theme.colors.textSecondary, mb: 2 }}
                  className="line-clamp-2"
                >
                  {blog.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </Typography>

                <Box className="flex items-center gap-4 mb-2">
                  <Box className="flex items-center gap-1">
                    <Person fontSize="small" sx={{ color: theme.colors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      {blog.author.username}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                    {formatDate(blog.createdAt)}
                  </Typography>
                </Box>

                <Box className="flex items-center gap-4 mb-2">
                  <Box className="flex items-center gap-1">
                    <Favorite fontSize="small" sx={{ color: theme.colors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      {blog.likesCount}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-1">
                    <Comment fontSize="small" sx={{ color: theme.colors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      {blog.commentsCount}
                    </Typography>
                  </Box>
                </Box>

                {blog.categories && blog.categories.length > 0 && (
                  <Box className="flex flex-wrap gap-1 mt-2">
                    {blog.categories.map((cat) => (
                      <Chip key={cat} label={cat} size="small" sx={{ mb: 1 }} />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;
