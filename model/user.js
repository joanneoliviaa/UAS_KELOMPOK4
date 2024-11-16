const db = require('./db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    return result.insertId;
  },
  findByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return result[0];
  },
};

module.exports = User;
