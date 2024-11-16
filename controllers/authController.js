const bcrypt = require('bcrypt');
const pool = require('../model/db');

// Endpoint Sign Up
const signup = async (req, res) => {
  const { fullName, dob, email, password, confirmPassword } = req.body;

  // Validate all input fields
  if (!fullName || !dob || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if email already exists
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  try {
    // Insert the new user into the database without hashing the password
    await pool.query(
      'INSERT INTO users (id, full_name, dob, email, password) VALUES ($1, $2, $3, $4, $5)',
      [fullName, dob, email, password] // Store password as plain text
    );

    // After successful sign-up, redirect to the index page
    res.redirect('/');  // Redirect to home page after successful signup
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
      // Invalid credentials, redirect to signin with error message
      return res.render('signin', { message: 'Invalid email or password', activePage: '/signin' });
    }

    // Compare the entered password with the stored password (plaintext comparison)
    if (password !== user.rows[0].password) {
      // Invalid credentials, redirect to signin with error message
      return res.render('signin', { message: 'Invalid email or password', activePage: '/signin' });
    }

    // If credentials are valid, redirect to index page
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Render Sign In page
const renderSigninPage = (req, res) => {
  res.render('signin', { activePage: '/signin', message: '' }); // Pass activePage and empty message initially
};

module.exports = { signup, signin, renderSigninPage };
