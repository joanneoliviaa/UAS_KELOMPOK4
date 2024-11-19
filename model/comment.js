const db = require('./db');

const Comment = {
  // Menambahkan komentar
  create: async (userId, mediaId, content) => {
    const result = await db.query('INSERT INTO comments (user_id, media_id, content) VALUES (?, ?, ?)', [userId, mediaId, content]);
    return result.insertId;
  },
  
  // Mengambil komentar berdasarkan mediaId
  findByMediaId: async (mediaId) => {
    const result = await db.query('SELECT comments.*, users.email FROM comments JOIN users ON comments.user_id = users.id WHERE comments.media_id = ? ORDER BY comments.created_at DESC', [mediaId]);
    return result;
  },
};

module.exports = Comment;
