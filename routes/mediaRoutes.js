const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../model/db');

router.get('/trends/:season', mediaController.renderTrendsPage);

router.get('/:season/:id', mediaController.getMediaDetail);

router.get('/api/comments/:mediaId', async (req, res) => {
    const mediaId = req.params.mediaId;
    try {
      const result = await pool.query('SELECT * FROM comments WHERE media_id = $1', [mediaId]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching comments');
    }
  });

 // Add a new comment (protected)
router.post('/api/comments', authMiddleware, async (req, res) => {
    const { comment, mediaId } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO comments (comment, media_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [comment, mediaId, req.user]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error adding comment');
    }
  });
  

module.exports = router;
