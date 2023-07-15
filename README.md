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
