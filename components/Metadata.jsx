import Head from 'next/head';

const Metadata = () => {
  return (
    <Head>
      <title>SessionScribe</title>
      <meta name="description" content="An audio-transcription-to-print pipeline for academic conference sessions" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content="audio, transcription, academic, conference, sessions, print" />
      <meta name="author" content="Christopher Carroll Smith, Kevin Mora" />
      <meta property="og:title" content="SessionScribe" />
      <meta property="og:description" content="An audio-transcription-to-print pipeline for academic conference sessions" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://session-scribe.vercel.com" />
      <meta name="theme-color" content="#1C1D20"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Metadata;
