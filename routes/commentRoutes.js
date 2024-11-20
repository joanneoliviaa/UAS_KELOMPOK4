const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Menampilkan komentar untuk media tertentu berdasarkan season
router.get('/trends/:season/:mediaId/comments', (req, res) => {
    const { season, mediaId } = req.params;
  
    // Query untuk mengambil komentar
    db.query(
      'SELECT c.content, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.season = $1 AND c.media_id = $2',
      [season, mediaId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching comments.' });
        }
        res.json({ comments: result.rows });
      }
    );
  });

  // Menambahkan komentar untuk media tertentu berdasarkan season
router.post('/trends/:season/:mediaId/comments', (req, res) => {
    const { season, mediaId } = req.params;
    const { userId, content } = req.body;
  
    if (!userId || !content) {
      return res.status(400).json({ message: 'Missing userId or content.' });
    }
  
    // Menyimpan komentar ke database
    db.query(
      'INSERT INTO comments (season, media_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [season, mediaId, userId, content],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error posting comment.' });
        }
        res.json({ comment: result.rows[0] });
      }
    );
  });  

module.exports = router;
