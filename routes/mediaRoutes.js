const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.get('/trends/:season', mediaController.renderTrendsPage);

router.get('/:season/:id', mediaController.getMediaDetail);

module.exports = router;
