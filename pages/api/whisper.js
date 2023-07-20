const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { audio } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        file: `data:audio/wav;base64,${audio}`,
        model: 'whisper-1'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const data = response.data;
    if (data.error) {
      console.error("Transcription error:", data.error);
      res.status(500).json({ error: "Error occurred during transcription." });
    } else {
      res.json({ transcription: data.text });
    }
  } catch (error) {
    console.error("An error occurred during transcription:", error);
    res.status(500).json({ error: "Error occurred during transcription." });
  }
});

module.exports = router;
