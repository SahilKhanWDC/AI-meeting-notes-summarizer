const express = require('express');
const { generateSummary } = require('../controllers/summaryController');
const geminiService = require('../config/gemini');

const router = express.Router();

// POST /api/generate-summary
router.post('/generate-summary', generateSummary);

// GET /api/test-gemini - Test Gemini API connection
router.get('/test-gemini', async (req, res) => {
  try {
    const result = await geminiService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error testing Gemini API connection',
      error: error.message 
    });
  }
});

module.exports = router;