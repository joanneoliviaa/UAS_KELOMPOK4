const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');

// Route untuk halaman trends berdasarkan musim
router.get('/:season', mediaController.renderTrendsPage);

// Route untuk detail media berdasarkan ID
router.get('/:season/:id', mediaController.getMediaDetail);

// Route untuk menambahkan komentar
router.post('/autumn/:trendId/comments', authMiddleware, (req, res) => {
    const { trendId } = req.params;
    const { comment } = req.body;
    const userId = req.session.userId;
  
    db.query(
      'INSERT INTO comments (trend_id, user_id, comment) VALUES ($1, $2, $3)',
      [trendId, userId, comment],
      (err) => {
        if (err) {
          res.status(500).json({ message: 'Error saving comment' });
        } else {
          res.json({ message: 'Comment added successfully!' });
        }
      }
    );
  });

module.exports = router;
