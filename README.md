# Transcribe Print Pipeline

Frontend for a third-place project from the August 2023 Epson Innovation Challenge hackathon, created by Christopher Smith and Kevin Mora. Meant to be used in combination with our [Python Whisper API](https://github.com/chriscarrollsmith/session-scribe-whisper-api).

You record in the various rooms at an academic conference; the audio files get transcribed to text by Elevenlabs; and the transcripts get printed from an Epson printer at a centralized printing station for distribution to anyone who missed the session.

## Dependencies and Usage

### Windows Execution Policy Change

```powershell
$ Set-ExecutionPolicy RemoteSigned :: select "y"
$ Get-ExecutionPolicy
$ RemoteSigned
```

### Install and Test Locally

```bash
$ cd {project-name}
$ npm install
$ npm run dev
```

## Development To-dos

- [ ] Add field(s) to the print page for the user to input presenter name and session title (or select from a dropdown?)
- [ ] Implement a webhook that the backend can ping when the transcription is complete so we can display an alert and update the print page
- [ ] Implement a user signup and auth system
- [ ] Enhance the Supabase database so it can track users, events, sessions, and permissions
- [ ] Implement a payment/transaction system with Stripe
- [ ] Enable users to connect with any printer, either by selling them one or having them provide their printer email address and API key
