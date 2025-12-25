const Comment = require('../models/comment.model');
const Blog = require('../models/blog.model');
const User = require('../models/user.model');

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const authorId = req.user.userId; // Get from authenticated user

    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Content is required and cannot be empty',
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(postId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Create comment (no parentComment for direct comments)
    const comment = new Comment({
      content: content.trim(),
      author: authorId,
      blog: postId,
      parentComment: null,
    });

    await comment.save();

    // Update blog's comment count
    blog.commentsCount += 1;
    await blog.save();

    // Populate author for response
    await comment.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
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
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const authorId = req.user.userId; // Get from authenticated user

    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Content is required and cannot be empty',
      });
    }

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found',
      });
    }

    // Get the blog ID from parent comment
    const blogId = parentComment.blog;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check if author exists
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Create reply comment
    const reply = new Comment({
      content: content.trim(),
      author: authorId,
      blog: blogId,
      parentComment: commentId,
    });

    await reply.save();

    // Update blog's comment count
    blog.commentsCount += 1;
    await blog.save();

    // Populate author for response
    await reply.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: reply,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Invalid comment ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error replying to comment',
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  replyToComment,
};


