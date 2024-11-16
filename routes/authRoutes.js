const express = require('express');
const router = express.Router();
const { signup, signin, renderSigninPage } = require('../controllers/authController');

router.get('/signin', renderSigninPage);

// POST: Sign Up
router.post('/signup', signup);

// POST: Sign In
router.post('/signin', signin);

module.exports = router;
