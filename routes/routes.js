const express = require('express');
const router = express.Router();
const { getData, addData } = require('../controllers/controller');
const  db  = require('../model/db');
const User = require('../model/user');
const Product = require('../model/product');
const { getAllProducts } = require('../controllers/productController');
const { getCartItems, updateCartItem, deleteCartItem, addItemToCart } = require('../controllers/cartController');
const pool = require('../model/db');

// Route untuk mengambil data
router.get('/data', getData);

// Route untuk menambah data
router.post('/data', addData);

// POST: Delete Account
router.post('/auth/delete-account', async (req, res) => {
    const userId = req.session.userId; // Ambil userId dari session
  
    if (!userId) {
      return res.status(401).json({ message: 'User not logged in' });
    }
  
    try {
      // Hapus user dari database
      const deleted = await User.deleteById(userId);
  
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hapus sesi pengguna
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Account deleted successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting account', error });
    }
  });

router.post('/auth/update-password', async (req, res) => {
    try {
      const userId = req.session.userId;  // Dapatkan userId dari session
      const { oldPassword, newPassword, confirmPassword } = req.body;  // Ambil data dari request
  
      if (!userId) {
        return res.status(400).json({ message: 'User not logged in' });
      }
  
      // Pastikan password baru dan konfirmasi password cocok
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      // Cek apakah password lama yang dimasukkan sesuai dengan yang ada di database
      const query = 'SELECT * FROM users WHERE id = $1';
      const values = [userId];
      const result = await db.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = result.rows[0];
  
      // Verifikasi password lama dengan yang ada di database
      if (user.password !== oldPassword) {
        return res.status(401).json({ message: 'Incorrect old password' });
      }
  
      // Update password baru di PostgreSQL
      const updateQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
      const updateValues = [newPassword, userId]; // Menggunakan password baru
      const updateResult = await db.query(updateQuery, updateValues);
  
      if (updateResult.rowCount === 0) {
        return res.status(500).json({ message: 'Failed to update password' });
      }
  
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password update:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route untuk mengambil semua produk
  router.get('/indexshop', getAllProducts); // Menggunakan controller untuk mendapatkan produk

  // Rute untuk menampilkan cart
  router.get('/cart', getCartItems);

  // Rute untuk menambahkan produk ke cart
  router.post('/cart/add', addItemToCart);

  // Rute untuk update quantity
  router.post('/cart/update/:productId', updateCartItem);

  // Rute untuk delete item
  router.post('/cart/delete/:productId', deleteCartItem);

  // Rute untuk checkout
router.post('/cart/checkout', async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
      return res.status(401).json({ message: 'User  not logged in' });
  }

  try {
      // Hapus semua item di cart untuk user ini
      await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

      // Redirect kembali ke halaman cart dengan pesan sukses
      res.redirect('/indexshop?message=Thank you for shopping');
  } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Error during checkout' });
  }
});
module.exports = router;
