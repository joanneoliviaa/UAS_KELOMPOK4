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
  res.render('articles', { activePage: '/news' }); // Hanya render template
});

router.get('/api/news/:id', async (req, res) => {
  const newsId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM news WHERE id = $1', [newsId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(result.rows[0]); // Kirim data artikel
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
