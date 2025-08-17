const geminiService = require('../config/gemini');

const generateSummary = async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    // Validation
    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Transcript is required and cannot be empty' 
      });
    }

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Custom prompt is required' 
      });
    }

    // Check transcript length (OpenAI has token limits)
    if (transcript.length > 50000) {
      return res.status(400).json({ 
        error: 'Transcript is too long. Please limit to 50,000 characters.' 
      });
    }

    console.log(`Generating summary for ${transcript.length} character transcript using Gemini AI...`);

    // Generate summary using Gemini service
    const summary = await geminiService.generateSummary(transcript, prompt);

    res.json({ 
      success: true,
      summary,
      metadata: {
        transcriptLength: transcript.length,
        promptUsed: prompt,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
};

module.exports = {
  generateSummary
};