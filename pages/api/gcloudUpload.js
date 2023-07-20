import { Storage } from '@google-cloud/storage';

const credentials = JSON.parse(process.env.GCLOUD_CREDENTIALS);
const storage = new Storage({ credentials });
const bucket = storage.bucket('session-scribe-bucket');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { filename, contentType } = req.body; 

      if (!filename || !contentType) {
        return res.status(400).json({ error: 'Missing required parameters.' });
      }

      // Generate a unique filename for every new file
      const uniqueFilename = `${Date.now()}-${filename}`;

      const file = bucket.file(uniqueFilename);
      
      // These options will allow temporary uploading of the file with outgoing response headers
      // set to a 1 minute limit
      const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
      };

      // Get a v4 signed URL for uploading file
      const [url] = await file.getSignedUrl(options);

      // Return the result to the client in the form of a JSON object
      res.status(200).json({ url });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
