const pool = require('./db');
const bcrypt = require('bcryptjs');
const query = (text, params) => {
  return pool.query(text, params);
};

const User = {
  // Membuat user baru dengan email dan password
  create: async (email, password) => {
    // Langsung memasukkan password tanpa di-hash
    const result = await query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password] // Menyimpan password tanpa di-hash
    );

    // Mengembalikan id user yang baru saja dibuat
    return result.rows[0].id;
  },

  // Mencari user berdasarkan email
  findByEmail: async (email) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0]; // Mengembalikan user pertama yang ditemukan
  },
};

module.exports = User;
