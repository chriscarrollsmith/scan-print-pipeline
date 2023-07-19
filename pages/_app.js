import '../styles/globals.css'
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return ( 
  <div>
    <Metadata />
    <Component {...pageProps} />
    <Footer />
  </div>
  )
}

export default MyApp
