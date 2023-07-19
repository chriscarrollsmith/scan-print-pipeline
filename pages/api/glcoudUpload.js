// Note: you need a gloudauth.json key file to make this work
import { Storage } from '@google-cloud/storage';

// Create a new Storage instance
const storage = new Storage({ keyFilename: process.env.GCLOUD_KEY_PATH });

// Reference an existing bucket
const bucket = storage.bucket('sessionscribe-393316');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const file = req.body.file; // The file is received as a Base64 string
      const filename = req.body.filename; // The filename is received in the request body

      const blob = bucket.file(filename.replace(/ /g, "_"));
      const blobStream = blob.createWriteStream({
        resumable: false
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send(publicUrl);
      });

      blobStream.on('error', err => {
        res.status(500).json({ error: err.message });
      });

      // Convert the Base64 string back to a Buffer and end the stream
      const buffer = Buffer.from(file, 'base64');
      blobStream.end(buffer);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
