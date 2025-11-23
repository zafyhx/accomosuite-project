const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect, admin } = require('../middleware/authMiddleware');

// Hanya admin yang boleh lihat log
router.get('/', protect, admin, getLogs);

module.exports = router;