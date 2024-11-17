const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

// Route untuk halaman trends berdasarkan musim
router.get('/:season', mediaController.renderTrendsPage);

// Route untuk detail media berdasarkan ID
router.get('/:season/:id', mediaController.getMediaDetail);

module.exports = router;
