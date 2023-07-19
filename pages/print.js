import styles from '../styles/Print.module.css'
import createPdf from '../scripts/createPdf'; // Make sure the path points to the correct location

async function passPdfToPrinter(content) {
  try {
    const pdfBuffer = await createPdf(content);
    // Now you can upload the pdfBuffer to your API or use it as you need
  } catch (error) {
    // Handle any errors that occurred during PDF generation
    console.error(error);
  }
}

const Print = () => {
    return (
        <div className="container">
            <main className="main">
                <h1 className={styles.title}>
                    SessionScribe
                </h1>
                <h1 className={styles.title}>
                    Print a transcript
                </h1>
            </main>
        </div>
    )
}

export default Print;