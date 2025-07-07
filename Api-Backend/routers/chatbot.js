const express = require("express");
const router = express.Router();
const { handleChat } = require("../Controllers/chatbotController");

// POST endpoint for chatbot queries
router.post("/chat", handleChat);

module.exports = router;
