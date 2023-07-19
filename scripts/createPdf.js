// createPdf.js
import pdfmake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

// Set up fonts
pdfmake.vfs = vfsFonts.pdfMake.vfs;

function createPdf(sessionTitle, presenters, content) {
  return new Promise((resolve, reject) => {
    // Define your document
    const docDefinition = {
        content: [
            { text: sessionTitle, style: 'header' },
            { text: 'Presenters: ' + presenters, style: 'subheader'},
            content
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 5],  // add space below the header
                color: 'darkblue'
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 10],  // add space below the header
                color: 'darkblue'
            }
        }
    };

    // Create a PDFKit document
    const pdfDoc = pdfmake.createPdf(docDefinition);

    // Collect chunks of data as they are generated
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
    
    // When the PDF generation is complete, resolve the Promise
    pdfDoc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });

    // If there's an error, reject the Promise
    pdfDoc.on('error', reject);

    // Start the PDF generation
    pdfDoc.end();
  });
}

export default createPdf;
