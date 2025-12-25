const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  validateRegister,
  validateLogin,
} = require('../controllers/auth.controller');

// POST /api/v1/auth/signup
router.post('/signup', validateRegister, registerUser);

// POST /api/v1/auth/login
router.post('/login', validateLogin, loginUser);

module.exports = router;

