const pool = require('../model/db');

function isAtLeast10YearsOld(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
}

// Endpoint Sign Up
const signup = async (req, res) => {
  const { full_name, dob, email, password, confirmPassword } = req.body;

  // Validate all input fields
  if (!full_name || !dob || !email || !password || !confirmPassword) {
    return res.send(`<script>alert('All fields are required'); window.history.back();</script>`);
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.send(`<script>alert('Passwords do not match'); window.history.back();</script>`);
  }

  if (isAtLeast10YearsOld(dob) < 10) {
    return res.send(`<script>alert('You must be at least 10 years old to sign up'); window.history.back();</script>`);
  }

  // Check if email already exists
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.send(`<script>alert('Email is already registered'); window.history.back();</script>`);
  }

  try {
    await pool.query(
      'INSERT INTO users (full_name, dob, email, password) VALUES ($1, $2, $3, $4)',
      [full_name, dob, email, password] 
    );

    res.redirect('/'); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Endpoint Sign In
const signin = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists in the database
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.render('signin', { message: 'Invalid credentials', activePage: '/signin' });
    }

    // Compare the entered password with the stored password (plaintext comparison)
    if (password !== user.rows[0].password) {
      return res.render('signin', { message: 'Invalid credentials', activePage: '/signin' });
    }

    // If credentials are valid, save session and redirect
    req.session.userId = user.rows[0].id;
    req.session.userName = user.rows[0].full_name;  
    res.redirect('/'); // Successful login, redirect to home page
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Render Sign In page
const renderSigninPage = (req, res) => {
  res.render('signin', { activePage: '/signin', message: '' }); 
};

//Render Sign Up Page
const renderSignUpPage = (req, res) => {
  res.render('signup', { activePage: '/signup', message: '' });
};

// Check Login Status (for isLoggedIn function in frontend)
const checkLogin = (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true, userName: req.session.userName, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
};

module.exports = { signup, signin, renderSigninPage, renderSignUpPage, checkLogin };