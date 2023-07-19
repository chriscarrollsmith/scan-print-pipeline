import { IncomingForm } from 'formidable';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const cleanInput = (s) => {
  if (typeof s === "undefined") return "";
  if (s === null) return "";
  if (typeof s !== "string") return String(s);
  return s.trim();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function whisperAPI(req, res) {
  if (req.method === 'POST') {
    console.log('POST request received');
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({fields, files});
      });
    });

    const file = data.files.file[0];
    const name = cleanInput(data.fields.name);
    const datetime = cleanInput(data.fields.datetime);
    const raw_options = cleanInput(data.fields.options);

    if (!file || !name || !datetime) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const options = JSON.parse(raw_options);
    const filename = `${name}.webm`;

    let formData = new FormData();
    const fileStream = fs.createReadStream(file.filepath);
    formData.append('file', fileStream, filename);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'vtt');
    formData.append('temperature', options.temperature);
    formData.append('language', options.language);

    const url = options.endpoint === 'transcriptions' ? 'https://api.openai.com/v1/audio/transcriptions' : 'https://api.openai.com/v1/audio/translations';

    // Get the headers from the form data (this includes the correct Content-Type header)
    const formHeaders = formData.getHeaders();

    try {
      let result = await axios.post(url, formData, {
        headers: {
          ...formHeaders,
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      return res.status(200).json({ 
          datetime,
          filename,
          data: result.data,
      });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
}
