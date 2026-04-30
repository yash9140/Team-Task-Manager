const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, getUserByEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.get('/users/email/:email', protect, getUserByEmail);

module.exports = router;
