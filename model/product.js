const pool = require('./db');

const Product = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM products');
        return result.rows;
    }
};

module.exports = Product;