# Transcribe Print Pipeline

A project for the Epson Challenge Hackathon.

_Academic conference printing station_. You record in the various rooms at an academic conference; the audio files get transcribed to text by Elevenlabs; and the transcripts get printed at a printing station for distribution to anyone who missed the session.

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

- [ ] I want to add field(s) to the print page for the user to input presenter name and session title (or select from a dropdown?)
- [ ] I want to implement a webhook that the backend can ping when the transcription is complete so we can display an alert and update the print page
- [ ] I want to implement a user signup and auth system
- [ ] I want to enhance the Supabase database so it can track users, events, sessions, and permissions
- [ ] I want to implement a payment/transaction system with Stripe
- [ ] I want to enable users to connect with a printer, either by selling them one or having them provide their printer email address and API key
