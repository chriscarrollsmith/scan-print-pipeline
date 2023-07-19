import Head from 'next/head';

const Metadata = () => {
  return (
    <Head>
      <title>SessionScribe</title>
      <meta name="description" content="An audio-transcription-to-print pipeline for academic conference sessions" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Metadata;
