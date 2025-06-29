// backend/routes/weather.js
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController.js');

router.get('/city/:name([a-zÀ-ÿ\\s-]+)', weatherController.buscarClima);

module.exports = router;