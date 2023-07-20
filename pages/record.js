import styles from '../styles/Record.module.css';
import { useState, useMemo } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios'; // Import axios for making HTTP requests

const Record = () => {
  const [audioBlob, setAudioBlob] = useState();
  const [transcript, setTranscript] = useState();
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const startRecording = () => {
    if (isBlocked) {
      console.log('Permission denied');
      setIsBlocked(true);
    } else {
      recorder.start().then(() => {
        setIsRecording(true);
      }).catch(e => console.error(e));
    }
  }

  const stopRecording = () => {
    setIsRecording(false);
    recorder.stop().getMp3().then(([buffer, blob]) => {
      const file = new File([buffer], 'demo', { type: blob.type });
      setBlobURL(URL.createObjectURL(blob));
      setAudioBlob(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsRecording(false);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "demo.wav"); 

      const response = await axios.post("/api/whisper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      if (data.error) {
        console.error("Transcription error:", data.error);
        setTranscript("Error occurred during transcription.");
      } else {
        setTranscript(data.transcription);
      }
    } catch (error) {
      console.error("An error occurred during transcription:", error);
      setTranscript("Error occurred during transcription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main className="main">
        <h1 className={styles.title}>
          SessionScribe
        </h1>
        <h1 className={styles.title}>
          Record a session
        </h1>
        <p className={styles.description}>Record an audio file, then click "Transcribe" to generate and upload a transcription of your recorded audio</p>
        {isRecording ? <p className={styles.warning}>Now recording your audio...</p> : <p className={styles.warning}>Allow microphone permissions after clicking "Record"</p>}
        {isBlocked ? <p className={styles.blocked}>Microphone access denied</p> : null}
        <div className={styles.whispercontainer}>
          <div className={styles.allbuttons}>
            <button onClick={startRecording} disabled={isRecording} className={styles.recordbutton}>Record</button>
            <button onClick={stopRecording} disabled={!isRecording} className={styles.stopbutton}>Stop</button>
          </div>
          <div className={styles.audiopreview}>
            <audio src={blobURL} controls="controls" />
          </div>
          <div className={styles.loading}>
            {loading ? <p>Processing...</p> : <p>{transcript}</p>}
          </div>
          <div className={styles.generatebuttonroot}>
            <button type="submit" className={styles.generatebutton} onClick={handleSubmit} disabled={!audioBlob}>Transcribe</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Record;
