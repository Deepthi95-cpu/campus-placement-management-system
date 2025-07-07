const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function handleChat(req, res) {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text ? await result.response.text() : null;

    if (!text) {
      return res.status(500).json({ error: "No response from Gemini." });
    }

    return res.json({ text });
  } catch (err) {
    console.error("Gemini API error:", err?.message);
    if (err.response) {
      console.error("Gemini Error Response:", err.response.data);
    }
    return res.status(500).json({
      error: "Gemini AI service failed.",
      message: err.message,
    });
  }
}

module.exports = { handleChat };
