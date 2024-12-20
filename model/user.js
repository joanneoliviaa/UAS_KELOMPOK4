const pool = require('./db');
const query = (text, params) => {
  return pool.query(text, params);
};

const User = {
  // Membuat user baru dengan email dan password
  create: async (email, password) => {
    // Langsung memasukkan password tanpa di-hash
    const result = await query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password] 
    );

    return result.rows[0].id;
  },

  // Mencari user berdasarkan email
  findByEmail: async (email) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  deleteById: async (id) => {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0; 
  },
};

module.exports = User;
