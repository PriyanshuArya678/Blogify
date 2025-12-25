const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserProfile,
  followUser,
  unfollowUser,
} = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');

// POST /api/v1/users - Create user
router.post('/', createUser);

// POST /api/v1/users/:userId/follow - Follow user (Protected)
// Must come before /:userId route to avoid route conflicts
router.post('/:userId/follow', authenticate, followUser);

// DELETE /api/v1/users/:userId/follow - Unfollow user (Protected)
// Must come before /:userId route to avoid route conflicts
router.delete('/:userId/follow', authenticate, unfollowUser);

// GET /api/v1/users/:userId - Get user profile (Public)
router.get('/:userId', getUserProfile);

module.exports = router;


