import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useMemo } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const Home = () => {

  const [audio, setAudio] = useState();
  const [transcript, setTranscript] = useState();
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  const startRecording = () => {
    if (isBlocked) {
      console.log('Permission Denied');
      setIsBlocked(true);
    } else {
      recorder
        .start()
        .then(() => {
          setIsRecording(true);
        })
        .catch(e => console.error(e));
    }
  }


  const stopRecording = () => {
    setIsRecording(false);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, 'disciple.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });
        setBlobURL(URL.createObjectURL(file));
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
          const base64data = reader.result;
          // Only send the base64 string
          const base64String = base64data.split(',')[1];
          setAudio(base64String);
        }
      }
      )
      }
      
      const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setIsRecording(false);
        
        const response = await fetch("/api/whisper", {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: audio }),
      });
      
      const data = await response.json();
      setLoading(false);
      setTranscript(data.modelOutputs[0].text);

  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Epson Hackathon</title>
        <meta name="description" content="Transcribe Print Pipeline" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        EPSON
        </h1>
        <h1 className={styles.title}>
        Transcribe Printing
        </h1>

        <p className={styles.description}> Obtain a Transcript by Recording an Audio </p>
        {isRecording ? <p className={styles.warning}> Recording in Progress... </p> : <p className={styles.warning}> Allow Microphone Permissions </p>}
        {isBlocked ? <p className={styles.blocked}> Microphone Access Denied </p> : null}

        <div className={styles.whispercontainer}>
          
          <div className = {styles.allbuttons}>
       <button onClick = {startRecording} disabled = {isRecording} className = {styles.recordbutton}>Record</button>
       <button onClick = {stopRecording} disabled = {!isRecording} className = {styles.stopbutton}>Stop</button>
       </div>

      <div className = {styles.audiopreview}>
       <audio src={blobURL} controls="controls" />
       </div>
       <div className = {styles.loading}>
       {loading ? <p>Processing...</p> :  <p>{transcript}</p>}
       </div>
          <div className = {styles.generatebuttonroot}>
            <button type = "submit" className = {styles.generatebutton} onClick = {handleSubmit} disabled = {!audio}>Generate</button>
            </div>
            </div>
            </main>

      <footer className={styles.footer}>
        <a
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Christopher Carroll & Kevin Mora
        </a>
      </footer>
    </div>
  )
}

export default Home;
