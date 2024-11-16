const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');

// POST: Sign Up
router.post('/signup', signup);

// POST: Sign In
router.post('/signin', signin);

module.exports = router;
