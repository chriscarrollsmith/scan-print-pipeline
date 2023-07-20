import styles from '../styles/Record.module.css';
import { useState, useMemo } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import FormData from 'form-data';

const Record = () => {
  const [audioBlob, setAudioBlob] = useState();
  const [transcript, setTranscript] = useState();
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const transcriptText = "this is some dummy transcript text for testing purposes"

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

  async function stopRecording() {
    setIsRecording(false);
    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        const file = new File(buffer, 'me-at-thevoice.mp3', {
          type: blob.type,
          lastModified: Date.now(),
        });
  
        console.log('file is', file);
        await uploadToGCloud(file);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  
  async function uploadToGCloud(file) {
    const filename = `audio-${generateUniqueBigInt()}.mp3`;
  
    try {
      // get signed URL from your API
      const response = await axios.post('/api/gcloudUpload', {
        filename,
        contentType: file.type,
      });
  
      const { url } = response.data;
  
      // upload file to the signed URL
      const result = await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
  
      console.log('File uploaded to GCloud:', result);
  
      // make a call to the Whisper API after the file is uploaded
      const transcribeResponse = await callWhisperAPI(url);
      console.log('Transcription:', transcribeResponse.data.text);
  
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
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

      const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setIsRecording(false);
        
        const formData = new FormData();
        formData.append('file', new Blob([audio], { type: 'audio/webm' }));
        formData.append('name', 'recorded_audio');
        formData.append('datetime', new Date().toISOString());

        // options can be changed according to requirements
        const options = {
          language: 'en', 
          temperature: 0.7,
          endpoint: 'transcriptions'
        };
        formData.append('options', JSON.stringify(options));

        const response = await fetch("/api/whisper", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        console.log(data);
        setLoading(false);
        setTranscript(data.data);
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
