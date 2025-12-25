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
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Person, Favorite, Comment as CommentIcon } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

interface Blog {
  _id: string;
  title: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

interface ProfileData {
  id: string;
  username: string;
  email: string;
  followersCount: number;
  followingCount: number;
  blogsCount: number;
  blogs: Blog[];
  createdAt: string;
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await profileAPI.getById(id!);
        const profileData = response.data.data;
        setProfile(profileData);
        // Check if current user is following this profile
        // Note: Backend would need to include this in response for accurate check
        // For now, we'll initialize as false and update on follow/unfollow
        setFollowing(false);
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Failed to load profile. Please try again.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      setError('Please login to follow users');
      return;
    }

    try {
      setFollowingLoading(true);
      setError('');
      if (following) {
        await profileAPI.unfollow(id!);
        setFollowing(false);
        if (profile) {
          setProfile({ ...profile, followersCount: Math.max(0, profile.followersCount - 1) });
        }
      } else {
        await profileAPI.follow(id!);
        setFollowing(true);
        if (profile) {
          setProfile({ ...profile, followersCount: profile.followersCount + 1 });
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to follow/unfollow user. Please try again.';
      setError(errorMsg);
    } finally {
      setFollowingLoading(false);
    }
  };

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
      <Container maxWidth="md" className="py-8">
        <Box className="flex justify-center items-center min-h-[400px]">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container maxWidth="md" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" className="py-8">
        <Alert severity="info">Profile not found</Alert>
      </Container>
    );
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <Container maxWidth="md" className="py-8">
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
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: theme.colors.text }}
            >
              {profile.username}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              {profile.email}
            </Typography>
          </Box>
          {!isOwnProfile && isAuthenticated && (
            <Button
              variant={following ? 'outlined' : 'contained'}
              onClick={handleFollow}
              disabled={followingLoading}
            >
              {followingLoading ? <CircularProgress size={20} /> : following ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>

        <Box className="flex gap-6 mb-4">
          <Box>
            <Typography variant="h6" sx={{ color: theme.colors.text }}>
              {profile.followersCount}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              Followers
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: theme.colors.text }}>
              {profile.followingCount}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              Following
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: theme.colors.text }}>
              {profile.blogsCount}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
              Blogs
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
          Member since {formatDate(profile.createdAt)}
        </Typography>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: theme.colors.text, mb: 3 }}
      >
        Blogs by {profile.username}
      </Typography>

      {profile.blogs.length === 0 ? (
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
            No blogs yet.
          </Typography>
        </Paper>
      ) : (
        <Box className="space-y-4">
          {profile.blogs.map((blog) => (
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
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ color: theme.colors.text, mb: 2 }}
                >
                  {blog.title}
                </Typography>

                <Box className="flex items-center gap-4">
                  <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                    {formatDate(blog.createdAt)}
                  </Typography>
                  <Box className="flex items-center gap-1">
                    <Favorite fontSize="small" sx={{ color: theme.colors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      {blog.likesCount}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-1">
                    <CommentIcon fontSize="small" sx={{ color: theme.colors.textSecondary }} />
                    <Typography variant="body2" sx={{ color: theme.colors.textSecondary }}>
                      {blog.commentsCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Profile;
