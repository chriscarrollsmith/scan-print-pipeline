require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const PDFDocument = require('pdfkit');

async function transcribe(file) {
  const response = await axios.post(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      file,
      model: 'whisper-1'
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  return response.data.text;
}

async function main() {
  // Add the path to the audio file you want to transcribe
  const file = fs.createReadStream('demo.mp3');
  const transcript = await transcribe(file);

  // Replace ". " with ".\n" to create a new line after each sentence.
  const formattedTranscript = transcript.replace(/\. /g, '.\n');

  // Create a PDF document
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('result.pdf'));

  // Add the formatted transcript to the PDF
  doc.font('Helvetica').fontSize(12).text(formattedTranscript, {
    align: 'justify',
    width: 465,
    lineGap: 5,
    indent: 30,
  });

  // Finalize the PDF and save it
  doc.end();

  console.log('Transcription saved to result.pdf');
}

main();
