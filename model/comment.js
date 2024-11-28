const db = require('./db'); // Database connection

const Comment = {
    // Add a comment
    create: async (userId, mediaId, content) => {
        const result = await db.query(
            'INSERT INTO comments (user_id, media_id, content) VALUES ($1, $2, $3) RETURNING id',
            [userId, mediaId, content]
        );
        return result.rows[0].id; // Return the new comment's ID
    },

    // Get comments for a specific media item
    
};

module.exports = Comment;