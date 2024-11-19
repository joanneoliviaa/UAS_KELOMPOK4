const express = require('express');
const router = express.Router();
const { signup, signin, renderSigninPage, renderSignUpPage } = require('../controllers/authController');
const User = require('../model/user'); 
const bcrypt = require('bcryptjs');

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
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    // Simpan informasi user di session, termasuk nama
    req.session.userId = user.id;
    req.session.userName = user.full_name;  
    
    // Redirect ke halaman utama
    res.redirect('/');
  });

// Check Login
router.get('/check-login', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;
