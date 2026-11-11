const express = require('express');
const validateChatInput = require('../middlewares/validateChatInput');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/', validateChatInput, chatController.sendMessage);

module.exports = router;
