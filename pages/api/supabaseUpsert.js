// pages/api/supabaseUpsert.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
const supabase = createClient(supabaseUrl, supabaseKey);

//req schema:
//{
//  "body": {
//    "sessionName": "Your Session Name",
//    "presenters": "Your Presenters",
//    "transcriptText": "Your Transcript Text",
//    "audioFilePath": "Your File Path",
//    "pdfFilePath": "Your File Path"
//  },
//  "method": "POST"
//}

export default async function supabaseUpsert(req, res) {
  if (req.method === 'POST') {
    const uniqueId = generateUniqueBigInt().toString();
    const createdAt = new Date().toISOString();

    // Get sessionName, transcriptText and filePath from req.body
    const { sessionName, presenters, transcriptText, filePath } = req.body;

    try {
      const { data, error } = await supabase
        .from('transcripts')
        .insert([
          { id: uniqueId, created_at: createdAt, session_name: sessionName, presenters: presenters, transcript: transcriptText, file_path: filePath },
        ])
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message || error.toString() });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

function generateUniqueBigInt() {
  return BigInt(Date.now());
}
