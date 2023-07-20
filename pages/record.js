import styles from '../styles/Record.module.css';
import { useState, useMemo } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios'; 
import { createPdf } from '../scripts/createPDF';

const Record = () => {
  const [audioBlob, setAudioBlob] = useState();
  const [transcript, setTranscript] = useState();
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [generatedMP3Blob, setGeneratedMP3Blob] = useState(); // State to store the generated MP3 blob

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  // Dummy values for session and presenters
  const sessionTitle = "Dummy Session";
  const presenters = "Dummy Presenters";

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
      const file = new File([buffer], 'demo.mp3', { type: blob.type }); // Set the filename to "demo.mp3"
      setBlobURL(URL.createObjectURL(blob));
      setAudioBlob(file);
      setGeneratedMP3Blob(blob); // Store the generated MP3 blob in the state
    });
  }

  async function uploadToGCloud(file, type) {
    const filename = `${type}-${generateUniqueBigInt()}.${type === 'audio' ? 'mp3' : 'pdf'}`;
  
    try {
      const response = await axios.post('/api/gcloudUpload', {
        filename,
        contentType: file.type,
      });
  
      const { url } = response.data;
  
      const result = await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
  
      console.log(`File uploaded to GCloud:`, result);
      return url; // return the uploaded file URL
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsRecording(false);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, 'demo.wav'); // Set the filename to "demo.wav"

      // 1) Call Whisper API for transcript
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

        // 2) Convert text to PDF
        const pdfBlob = createPdf(sessionTitle, presenters, data.transcription);

        // 3) Upload audio and PDF to Google Cloud Storage
        const audioFilePath = await uploadToGCloud(audioBlob, 'audio');
        const pdfFilePath = await uploadToGCloud(pdfBlob, 'pdf');

        // 4) Make request to `api/supabaseUpsert`
        await upsertTranscript(sessionTitle, data.transcription, audioFilePath, pdfFilePath);
      }

      // Call the function to trigger the download after successful transcription
      downloadGeneratedMP3();
    } catch (error) {
      console.error("An error occurred during transcription:", error);
      setTranscript("Error occurred during transcription.");
    } finally {
      setLoading(false);
    }
  }
  
  function generateUniqueBigInt() {
    return BigInt(Date.now());
  }

  async function upsertTranscript(sessionName, transcriptText, audioFilePath, pdfFilePath) {
    try {
      const response = await axios.post('/api/supabaseUpsert', {
        sessionName,
        transcriptText,
        audioFilePath,
        pdfFilePath
      });
  
      if (response.status === 200) {
        console.log('Record inserted:', response.data);
      } else {
        console.error('Error inserting record:', response);
      }
    } catch (error) {
      console.error('Error inserting record:', error);
    }
  }

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
