const express = require('express');
const router = express.Router();
const { getData, addData } = require('../controllers/controller');
const { pool } = require('../model/db');

// Route untuk mengambil data
router.get('/data', getData);

// Route untuk menambah data
router.post('/data', addData);

// POST: Delete Account
router.post('/delete-account', (req, res) => {
    const userId = req.session.userId;  // Get the userId from the session

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' });
    }

    // Find the user and delete from the database
    User.findByIdAndDelete(userId)
        .then(() => {
            // Destroy session after deleting the user
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error logging out' });
                }
                res.json({ message: 'Account deleted successfully' });
            });
        })
        .catch(error => res.status(500).json({ message: 'Error deleting account', error }));
});

module.exports = router;
