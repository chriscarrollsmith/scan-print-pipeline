// pages/api/print.js
import { Client } from 'epson-connect-js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filePath } = req.body;

    // Check if filePath is provided
    if (!filePath) {
      res.status(400).json({ error: 'filePath is required' });
      return;
    }

    const client = new Client();
    await client.initialize();

    // Get the printer
    const printer = client.printer;

    const settings = {};  // Empty settings

    try {
      // Set print job settings
      const jobData = await printer.printSetting(settings);
        
      // Upload file for printing
      await printer.uploadFile(jobData.upload_uri, filePath, 'document')
      
      // Use the printer instance to execute a print job
      const response = await printer.executePrint(jobData.id)
      
      res.status(200).json(response);  // Respond with the printer's response
    } catch (err) {
      console.error('Error when trying to print:', err);  // Log the error to the console
      res.status(500).json({ error: err.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
