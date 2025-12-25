const User = require('../models/user.model');
const Blog = require('../models/blog.model');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    const user = new User({
      username,
      email,
      password, // No hashing yet as per requirements
      followers: [],
      following: [],
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('username email followers following createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get blogs created by this user
    const blogs = await Blog.find({ author: userId })
      .select('title createdAt likesCount commentsCount')
      .sort({ createdAt: -1 });

    // Calculate counts
    const followersCount = user.followers.length;
    const followingCount = user.following.length;

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        followersCount,
        followingCount,
        blogsCount: blogs.length,
        blogs: blogs,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: error.message,
    });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Check if user is trying to follow themselves
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    // Find both users
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found',
      });
    }

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    // Add target user to current user's following array
    currentUser.following.push(userId);
    await currentUser.save();

    // Add current user to target user's followers array
    targetUser.followers.push(currentUserId);
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
      data: {
        followingCount: currentUser.following.length,
        followersCount: targetUser.followers.length,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error following user',
      error: error.message,
    });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    // Check if user is trying to unfollow themselves
    if (userId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself',
      });
    }

    // Find both users
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Current user not found',
      });
    }

    // Check if currently following
    const isFollowing = currentUser.following.includes(userId);

    if (!isFollowing) {
      // Safe no-op - user is not following, but return success
      return res.status(200).json({
        success: true,
        message: 'You are not following this user',
        data: {
          followingCount: currentUser.following.length,
          followersCount: targetUser.followers.length,
        },
      });
    }

    // Remove target user from current user's following array
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save();

    // Remove current user from target user's followers array
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
      data: {
        followingCount: currentUser.following.length,
        followersCount: targetUser.followers.length,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error unfollowing user',
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUserProfile,
  followUser,
  unfollowUser,
};


