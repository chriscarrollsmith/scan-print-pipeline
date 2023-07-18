// Enter your Banana API keys in .env.local
const apiKey = process.env.OPENAI_API_KEY;

// This model does not work as of now
export default async function (req, res) {

    const modelParameters = {
        "mp3BytesString": req.body.audio
    }

    const output = await openai.run(apiKey, modelParameters);

    res.status(200).json(output);

}