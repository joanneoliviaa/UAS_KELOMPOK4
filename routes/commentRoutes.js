const express = require('express');
const router = express.Router();
const db = require('../model/db');

// Get comments for a specific media item by season
router.get('/trends/:season/:mediaId/comments', (req, res) => {
    const { season, mediaId } = req.params;

    db.query(
        `SELECT 
            c.content, 
            u.full_name AS user_name 
        FROM 
            comments c 
        LEFT JOIN 
            users u ON c.user_id = u.id
        JOIN 
            media_content m ON c.media_id = m.id
        WHERE 
            m.season = $1 AND c.media_id = $2`,
        [season, mediaId],
        (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Error fetching comments.' });
            }
            res.json({ comments: result.rows });
        }
    );
});

// Post a comment for a specific media item by season
router.post('/trends/:season/:mediaId/comments', async (req, res) => {
    const { mediaId } = req.params; // Only mediaId is needed for comment association
    const { content } = req.body;  // Extract content from the request body

    // Validate the input
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comment content cannot be empty.' });
    }

    try {
        const userId = req.session?.userId || null; // Use session userId if logged in, else NULL
        const result = await db.query(
            `INSERT INTO comments (media_id, user_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING id, content, created_at`,
            [mediaId, userId, content]
        );

        const newComment = {
            id: result.rows[0].id,
            content: result.rows[0].content,
            created_at: result.rows[0].created_at,
            user_name: userId
                ? (await db.query('SELECT full_name FROM users WHERE id = $1', [userId])).rows[0]?.full_name
                : 'Anonymous', // Use 'Anonymous' if userId is null
        };

        res.status(201).json({ comment: newComment });
    } catch (err) {
        console.error('Error posting comment:', err);
        res.status(500).json({ message: 'Error posting comment.' });
    }
});

module.exports = router;