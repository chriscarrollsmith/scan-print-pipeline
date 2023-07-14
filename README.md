# scan-print-pipeline

A project for the Epson Challenge Hackathon

## Project ideas

- *Academic conference printing station*. You record in the various rooms at an academic conference; the audio files get transcribed to text by Elevenlabs; and the transcripts get printed at a printing station for distribution to anyone who missed the session.
- *Document scanning to semantic search*. You scan a document; the text gets chunked and embedded into a vector database; and you can search and print excerpts.
- *Wedding photo booth*. You take a photo; generative AI performs some kind of modification of the photo (e.g., captioning, style transfer, crazy hairstyles); and you can print the photo. The challenge here is to programmatically generate the image mask. I'm unsure how achievable this is. Possibly you could have the user create the mask manually using some kind of photo editing interface, or possibly you could use some kind of object detection to automatically generate the mask.

## Research notes

Explanation of how to use edits with the Dall-E API: https://platform.openai.com/docs/guides/images/usage.

- Editing an image requires having a mask (i.e., a PNG with transparent pixels indicating where edits should be made). 