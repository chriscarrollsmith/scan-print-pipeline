require('dotenv').config();

const fs = require('fs');
const axios = require('axios');

async function transcribe(file) {
  try {
    const formData = new FormData();
    formData.append('file', file); // Add the file to the FormData

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData, // Use the FormData object as the data
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return response.data.text;
  } catch (error) {
    console.error('Error during transcription:', error.message);
    throw error; // Rethrow the error to the calling function
  }
}

async function main() {
  const file = fs.createReadStream('disciple.mp3');
  console.log('Starting transcription...');
  try {
    const transcript = await transcribe(file);
    console.log('Transcription successful:', transcript);
  } catch (error) {
    console.error('Transcription error:', error);
  }
}

main();