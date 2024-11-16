const bcrypt = require('bcrypt');
const pool = require('../model/db');

// Fungsi untuk validasi usia
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
  const { fullName, dob, email, password, confirmPassword } = req.body;

  // Validasi semua input
  if (!fullName || !dob || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (isAtLeast10YearsOld(dob) < 10) {
    return res.status(400).json({ message: 'You must be at least 10 years old to sign up' });
  }

  try {
    // Periksa apakah email sudah terdaftar
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    await pool.query(
      'INSERT INTO users (full_name, dob, email, password) VALUES ($1, $2, $3, $4)',
      [fullName, dob, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
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
    // Periksa apakah user ada di database
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Jika berhasil login
    res.status(200).json({ message: 'Sign In successful', user: { email: user.rows[0].email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signup, signin };
