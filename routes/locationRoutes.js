const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.use(isLoggedIn);

router.get('/mapa-rotas', locationController.viewLocations);

module.exports = router;
