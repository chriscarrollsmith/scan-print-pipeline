import styles from '../styles/Record.module.css';
import { useState, useMemo } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import axios from 'axios'; 

const Record = () => {
  const [audioBlob, setAudioBlob] = useState();
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(""); // add new state for result message

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

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
      const file = new File(buffer, 'me.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });
      setAudioBlob(file);
      setBlobURL(URL.createObjectURL(blob));
    }).catch((e) => {
      console.log(e);
    });
  };

  async function uploadToGCloud(file, type, unique_id) {
    const filename = `${type}-${unique_id}.${type === 'audio' ? 'mp3' : 'pdf'}`;

    try {
      const response = await axios.post('/api/gcloudUpload', {
        filename,
        contentType: file.type,
      });

      const { url } = response.data;

      // promisifying reader operation
      const reader = new FileReader();
      const promise = new Promise((resolve, reject) => {
        reader.onloadend = async (event) => {
          const blob = new Blob([new Uint8Array(event.target.result)], { type: file.type });

          try {
            const result = await axios.put(url, blob, {
              headers: {
                'Content-Type': file.type,
              },
            });

            console.log(`File uploaded to GCloud:`, result);
            resolve(url); // resolve the promise with the url
          } catch (error) {
            reject(`Error uploading file: ${error}`);
          }
        };
      });

      reader.readAsArrayBuffer(file);

      return await promise; // await the promise
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
    }
  }

  async function transcribeAudio(url, unique_id, session_title, presenters) {
    try {
      const response = await axios.post('/api/transcribe', {
        src_url: url,
        unique_id: unique_id,
        session_title: session_title,
        presenters: presenters,
        is_video: false
      });
      console.log(response.data);
      return response.data; // Add this line
    } catch (error) {
      console.error(error);
    }
  }  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, 'demo.mp3'); // Set the filename to "demo.mp3"
  
      // 1) Generate unique id
      const unique_id = generateUniqueBigInt();
  
      // 2) Upload to GCloud
      const audioFilePath = await uploadToGCloud(audioBlob, 'audio', unique_id);
      console.log("Audio file path:", audioFilePath);
  
      // 3) Transcribe audio
      const response = await transcribeAudio(audioFilePath, unique_id, sessionTitle, presenters);
      if (!response.job_id) {
        throw new Error('Transcription request failed');
      } else {
        setResultMessage("Success!"); // set success message
      }
    } catch (error) {
      console.error(error);
      setResultMessage("Error!"); // set error message
    } finally {
      setLoading(false); // stop loading after transcription completes, whether it succeeds or fails
    }
  }
  
  function generateUniqueBigInt() {
    return Date.now();
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
            {loading ? <p>Processing...</p> : <p>{resultMessage}</p>} 
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
