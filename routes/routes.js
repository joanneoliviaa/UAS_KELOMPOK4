const express = require('express');
const router = express.Router();
const { getData, addData } = require('../controllers/controller');

// Route untuk mengambil data
router.get('/data', getData);

// Route untuk menambah data
router.post('/data', addData);

module.exports = router;
