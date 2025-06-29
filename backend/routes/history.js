// backend/routes/history.js
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const ensureAuthenticated = require('../middleware/authMiddleware');

router.get('/', ensureAuthenticated, historyController.getUserHistory);

module.exports = router;
