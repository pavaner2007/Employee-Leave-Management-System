const express = require('express');
const router = express.Router();
const { generateReason } = require('../controllers/aiController');
const auth = require('../middleware/auth');

// POST /ai/generate
router.post('/generate', auth, generateReason);

module.exports = router;
