import '../styles/globals.css'
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return ( 
  <div>
    <Metadata />
    <Header />
    <Component {...pageProps} />
    <Footer />
  </div>
  )
}

export default MyApp
