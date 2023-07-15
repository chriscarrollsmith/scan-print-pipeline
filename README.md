# Scan Print Pipeline

A project for the Epson Challenge Hackathon.

*Academic conference printing station*. You record in the various rooms at an academic conference; the audio files get transcribed to text by Elevenlabs; and the transcripts get printed at a printing station for distribution to anyone who missed the session.

### Dependencies and Usage
#### Windows Execution Policy Change
```r
Run the following commands sequentially:

Set-ExecutionPolicy RemoteSigned :: select "y"
Get-ExecutionPolicy
RemoteSigned
```

#### Run in VS Code Terminal
```r
npm install
npm --version
yarn add dotenv axios
```

## Research Notes

Explanation of how to use edits with the Dall-E API: https://platform.openai.com/docs/guides/images/usage.
- Editing an image requires having a mask (i.e., a PNG with transparent pixels indicating where edits should be made).

## Other Ideas
- *Document scanning to semantic search*. You scan a document; the text gets chunked and embedded into a vector database; and you can search and print excerpts.
- *Wedding photo booth*. You take a photo; generative AI performs some kind of modification of the photo (e.g., captioning, style transfer, crazy hairstyles); and you can print the photo. The challenge here is to programmatically generate the image mask. I'm unsure how achievable this is in the time available. Possibly you could have the user create the mask manually using some kind of photo editing interface, or possibly you could use some kind of object detection to automatically generate the mask. But if you can figure that out, then the rest of the pipeline should be straightforward.
