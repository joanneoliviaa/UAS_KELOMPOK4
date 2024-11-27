const express = require('express');
const db = require('../model/db'); 
const router = express.Router();

// Render halaman news.ejs
router.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM news ORDER BY created_at DESC');
      res.render('news', { newsList: result.rows, activePage: '/news' }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error loading news');
    }
  });

// Endpoint untuk mendapatkan semua berita
router.get('/api/news', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json({ news: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  res.render('articles', { activePage: '/news' }); 
});

router.get('/api/news/:id', async (req, res) => {
  const newsId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM news WHERE id = $1', [newsId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(result.rows[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/auth/update-password', async (req, res) => {
  try {
    const userId = req.session.userId;  // Dapatkan userId dari session
    const { oldPassword, newPassword, confirmPassword } = req.body;  // Ambil data dari request

    if (!userId) {
      return res.status(400).json({ message: 'User not logged in' });
    }

    // Pastikan password baru dan konfirmasi password cocok
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Cek apakah password lama yang dimasukkan sesuai dengan yang ada di database
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // Verifikasi password lama dengan yang ada di database
    if (user.password !== oldPassword) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // Update password baru di PostgreSQL
    const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
    const updateValues = [newPassword, userId]; // Menggunakan password baru
    const updateResult = await db.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(500).json({ message: 'Failed to update password' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
