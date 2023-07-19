const openai = require('openai');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const apiKey = process.env.OPENAI_API_KEY;
openai.apiKey = apiKey;

export default async function handler(req, res) {
  try {
    const modelParameters = {
      mp3BytesString: req.body.audio
    };

    // Use the appropriate OpenAI API method for your task
    // For example, if you want to use the OpenAI GPT-3 model, you would use openai.Completion.create
    const output = await openai.Completion.create(modelParameters);

    if (output.choices && output.choices.length > 0) {
      res.status(200).json(output.choices[0]);
    } else {
      console.error("Invalid output data");
      res.status(500).json({ error: 'Invalid output data' });
      // Handle the case when the output is empty or undefined
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: 'An error occurred' });
    // Handle any other potential errors that may occur during the API request or processing
  }
}
