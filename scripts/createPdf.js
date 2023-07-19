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

    // Get buffer
    pdfDoc.getBuffer(buffer => {
      // Convert buffer to base64 string
      const base64String = buffer.toString('base64');
      resolve(base64String);
    });

    // Error event listener
    pdfDoc.on('error', err => {
      // Reject the promise with the error
      reject(err);
    });

    pdfDoc.end();
  });
}

export default createPdf;
