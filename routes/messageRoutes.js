const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.get('/', isLoggedIn, messageController.getMessages);
router.post('/', isLoggedIn, messageController.sendMessage);

module.exports = router;
