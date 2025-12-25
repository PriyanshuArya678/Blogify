const express = require('express');
const router = express.Router();
const { replyToComment } = require('../controllers/comment.controller');
const authenticate = require('../middlewares/auth.middleware');

// POST /api/v1/comments/:commentId/reply - Reply to comment (Protected)
router.post('/:commentId/reply', authenticate, replyToComment);

module.exports = router;

