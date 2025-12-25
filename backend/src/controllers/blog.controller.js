const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const { CATEGORIES, TAGS } = require('../utils/constants');

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, content, categories, tags, media } = req.body;
    const authorId = req.user.userId; // Get from authenticated user

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    // Validate categories
    if (categories && Array.isArray(categories)) {
      const invalidCategories = categories.filter(
        (cat) => !CATEGORIES.includes(cat)
      );
      if (invalidCategories.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid categories: ${invalidCategories.join(', ')}`,
        });
      }
    }

    // Validate tags
    if (tags && Array.isArray(tags)) {
      const invalidTags = tags.filter((tag) => !TAGS.includes(tag));
      if (invalidTags.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid tags: ${invalidTags.join(', ')}`,
        });
      }
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    const blog = new Blog({
      title,
      content,
      author: authorId,
      categories: categories || [],
      tags: tags || [],
      media: media || [],
      likes: [],
      likesCount: 0,
      commentsCount: 0,
    });

    await blog.save();

    // Populate author for response
    await blog.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message,
    });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving blogs',
      error: error.message,
    });
  }
};

// Get single blog by ID
const getSingleBlog = async (req, res) => {
  try {
    const { postId } = req.params;

    const blog = await Blog.findById(postId).populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog retrieved successfully',
      data: blog,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving blog',
      error: error.message,
    });
  }
};

// Like a blog
const likeBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const blog = await Blog.findById(postId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if user already liked
    if (blog.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this blog',
      });
    }

    // Add user to likes array
    blog.likes.push(userId);
    blog.likesCount = blog.likes.length;
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      data: {
        likesCount: blog.likesCount,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error liking blog',
      error: error.message,
    });
  }
};

// Unlike a blog
const unlikeBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const blog = await Blog.findById(postId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if user has liked
    if (!blog.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this blog',
      });
    }

    // Remove user from likes array
    blog.likes = blog.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    blog.likesCount = blog.likes.length;
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog unliked successfully',
      data: {
        likesCount: blog.likesCount,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid blog ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error unliking blog',
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  likeBlog,
  unlikeBlog,
};


