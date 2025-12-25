import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { Favorite, Comment as CommentIcon, Person } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { blogsAPI, commentsAPI } from '../services/api';

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
  likes: string[];
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await blogsAPI.getById(id!);
        const blogData = response.data.data;
        setBlog(blogData);
        // Check if user has liked this blog
        if (user && blogData.likes) {
          setLiked(blogData.likes.includes(user.id) || blogData.likes.some((like: any) => like.toString() === user.id));
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load blog. Please check your connection and try again.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError('Please login to like this blog');
      return;
    }

    try {
      setLiking(true);
      setError('');
      if (liked) {
        await blogsAPI.unlike(id!);
        setLiked(false);
        if (blog) {
          setBlog({ ...blog, likesCount: Math.max(0, blog.likesCount - 1) });
        }
      } else {
        await blogsAPI.like(id!);
        setLiked(true);
        if (blog) {
          setBlog({ ...blog, likesCount: blog.likesCount + 1 });
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to like/unlike blog';
      setError(errorMsg);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      setError('Please login to add a comment');
      return;
    }

    if (!commentContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await commentsAPI.add(id!, commentContent);
      setCommentContent('');
      // Refresh blog to get updated comment count
      const response = await blogsAPI.getById(id!);
      setBlog(response.data.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to add comment. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (error && !blog) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="info">Blog not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ color: theme.colors.text, mb: 2 }}
        >
          {blog.title}
        </Typography>

        <Box className="flex items-center gap-4 mb-4">
          <Box className="flex items-center gap-1">
            <Person fontSize="small" sx={{ color: theme.colors.textSecondary }} />
            <Link
              to={`/profile/${blog.author._id}`}
              style={{ color: theme.colors.primary, textDecoration: 'none' }}
            >
              <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                {blog.author.username}
              </Typography>
            </Link>
          </Box>
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
            {formatDate(blog.createdAt)}
          </Typography>
        </Box>

        <Box className="flex items-center gap-4 mb-4">
          <Button
            variant={liked ? 'contained' : 'outlined'}
            startIcon={<Favorite />}
            onClick={handleLike}
            disabled={liking || !isAuthenticated}
            size="small"
          >
            {blog.likesCount}
          </Button>
          <Box className="flex items-center gap-1">
            <CommentIcon fontSize="small" sx={{ color: theme.colors.textSecondary }} />
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              {blog.commentsCount}
            </Typography>
          </Box>
        </Box>

        {blog.categories && blog.categories.length > 0 && (
          <Box className="flex flex-wrap gap-1 mb-2">
            {blog.categories.map((cat) => (
              <Chip key={cat} label={cat} size="small" sx={{ mb: 1 }} />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            color: theme.colors.text,
            '& img': {
              maxWidth: '100%',
              height: 'auto',
            },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </Paper>

      {/* Comments Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <Typography variant="h5" sx={{ color: theme.colors.text, mb: 3 }}>
          Comments ({blog.commentsCount})
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Add a comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={submitting}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={submitting || !commentContent.trim()}
            >
              {submitting ? <CircularProgress size={20} /> : 'Add Comment'}
            </Button>
          </Box>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please <Link to="/login">login</Link> to add comments
          </Alert>
        )}

        {blog.commentsCount === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              No comments yet. Be the first to comment!
            </Typography>
          </Paper>
        ) : (
          <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
            {blog.commentsCount} comment{blog.commentsCount !== 1 ? 's' : ''} on this blog.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default BlogDetail;
