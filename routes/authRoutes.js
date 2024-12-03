const express = require('express');
const router = express.Router();
const { signup, signin, renderSigninPage, renderSignUpPage } = require('../controllers/authController');
const User = require('../model/user'); 

// Route akses
router.get('/signup', renderSignUpPage);
router.get('/signin', renderSigninPage);

// POST: Sign Up
router.post('/signup', signup);

// POST: Sign In
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.render('signin', { message: 'Invalid credentials', activePage: '/signin' });
  }

  if (user.password !== password) {
    return res.render('signin', { message: 'Invalid credentials', activePage: '/signin' });
  }

  req.session.userId = user.id;
  req.session.userName = user.full_name;

  res.redirect('/');
});

// Check Login
router.get('/check-login', (req, res) => {
  if (req.session && req.session.userId) {
    const userName = req.session.userName;
    const userID = req.session.id;
    res.json({ loggedIn: true, userName: userName, userID: userID });
  } else {
    res.json({ loggedIn: false});
  }
});

module.exports = router;
