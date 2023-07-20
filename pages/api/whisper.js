import { IncomingForm } from 'formidable'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const cleanInput = (s) => {
  if (typeof s === "undefined") return "";
  if (s === null) return "";
  if (typeof s !== "string") return String(s);
  return s.trim();
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function whisperAPI(req, res) {
  if (req.method === 'POST') {
    console.log('POST request received'); // Added logging
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err); // Added logging
          reject(err);
        }
        console.log('Form parsed:', {fields, files}); // Added logging
        resolve({fields, files});
      });
    });

    const file = data.files.file[0];
    const name = cleanInput(data.fields.name);
    const datetime = cleanInput(data.fields.datetime);
    const raw_options = cleanInput(data.fields.options);

    /**
     * Simple form validation
     */
    if(!file || !name || !datetime) {
        console.error('Bad request:', {file, name, datetime}); // Added logging
        return res.status(400).json({ message: 'Bad Request' });
    }

    const options = JSON.parse(raw_options);
    console.log('Options:', options); // Added logging
    const filename = `${name}.webm`;

    let header = {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }

    let formData = new FormData()
    console.log('File path:', file);
    const fileStream = fs.createReadStream(file.filepath);
    formData.append('file', fileStream, filename); // Append the file directly
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'vtt') // e.g. text, vtt, srt
    formData.append('temperature', options.temperature)
    formData.append('language', options.language)

    const url = options.endpoint === 'transcriptions' ? 'https://api.openai.com/v1/audio/transcriptions' : 'https://api.openai.com/v1/audio/translations'
    console.log('URL:', url); // Added logging
    
    // Get the headers from the form data (this includes the correct Content-Type header)
    const formHeaders = formData.getHeaders();

    try {
      let result = await new Promise((resolve, reject) => {
        axios.post(url, formData, {
          headers: {
            ...formHeaders,
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }).then((response) => {
            console.log('API response received:', response); // Added logging
            resolve(response); // Returning the whole response object
        }).catch((error) => {
            console.error('API error:', error); // Added logging
            reject(error); // Maybe rather than sending the whole error message, set some status value
        })
      })

      const data = result.data;

      return res.status(200).json({ 
          datetime,
          filename,
          data,
      })

    } catch (error) {
        console.error('Error:', error); // Added logging
        return res.status(400).json({ message: error.message })
    }

  } else {
    console.log('Request method is not POST'); // Added logging
    res.status(404).json({ message: 'Not Found' });
  }
}