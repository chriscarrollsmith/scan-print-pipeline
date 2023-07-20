import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      res.status(500).json({ error: "Error occurred during transcription." });
      return;
    }

    const audioFile = files.audio;
    if (!audioFile || audioFile.type !== 'audio/wav') {
      res.status(400).json({ error: "Invalid audio file. Please upload a WAV file." });
      return;
    }

    try {
      const transcriptionResult = "This is a dummy transcription result.";
      res.json({ transcription: transcriptionResult });
    } catch (error) {
      console.error("An error occurred during transcription:", error);
      res.status(500).json({ error: "Error occurred during transcription." });
    } finally {
      // Delete the temporary audio file after transcription
      fs.unlinkSync(audioFile.path);
    }
  });
};

export default handler;
