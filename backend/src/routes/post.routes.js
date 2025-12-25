const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  likeBlog,
  unlikeBlog,
} = require('../controllers/blog.controller');
const { addComment } = require('../controllers/comment.controller');
const authenticate = require('../middlewares/auth.middleware');

// GET /api/v1/posts - Get all blogs (Public)
router.get('/', getAllBlogs);

// GET /api/v1/posts/:postId - Get single blog (Public)
router.get('/:postId', getSingleBlog);

// POST /api/v1/posts - Create blog (Protected)
router.post('/', authenticate, createBlog);

// POST /api/v1/posts/:postId/like - Like blog (Protected)
router.post('/:postId/like', authenticate, likeBlog);

// DELETE /api/v1/posts/:postId/like - Unlike blog (Protected)
router.delete('/:postId/like', authenticate, unlikeBlog);

// POST /api/v1/posts/:postId/comments - Add comment (Protected)
router.post('/:postId/comments', authenticate, addComment);

module.exports = router;


