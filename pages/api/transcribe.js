import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log(req.body)
      const { src_url, unique_id, session_title, presenters, is_video } = req.body;
      
      const response = await axios.post('https://chriscarrollsmith--whisper-audio-video-transcriber-api-v-4c6a21.modal.run/api/transcribe2', {
        src_url,
        unique_id,
        session_title,
        presenters,
        is_video
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Unable to process your request at this time.' });
    }
  } else {
    res.status(405).json({ error: 'We only support POST requests.' });
  }
}
