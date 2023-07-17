const { Pinecone } = require('@openai/pinecone');
const fs = require('fs');

class PineconeUploader {
  constructor(apiKey) {
    this.pinecone = new Pinecone({ apiKey });
    this.uploadDir = './public/uploads';
  }

  async readFilesFromUploadDir() {
    try {
      const files = fs.readdirSync(this.uploadDir);
      return files;
    } catch (error) {
      console.error('Error reading files from upload directory:', error);
      return [];
    }
  }

  async vectorizeFiles(files) {
    try {
      // Example: Read the file content and convert it into a vector representation
      const vectors = files.map((file) => {
        const fileContent = fs.readFileSync(`${this.uploadDir}/${file}`, 'utf8');
        // ... vectorization process
        return yourVectorRepresentation;
      });
      return vectors;
    } catch (error) {
      console.error('Error vectorizing files:', error);
      return [];
    }
  }

  async uploadDataToPinecone(vectors) {
    try {
      await this.pinecone.index.upsert(vectors);
      console.log('Data uploaded to Pinecone successfully!');
    } catch (error) {
      console.error('Error uploading data to Pinecone:', error);
    }
  }

  async processAndUploadFiles() {
    try {
      const files = await this.readFilesFromUploadDir();
      const vectors = await this.vectorizeFiles(files);
      await this.uploadDataToPinecone(vectors);
    } catch (error) {
      console.error('Error processing and uploading files:', error);
    }
  }
}

// Key and Usage
const apiKey = '';
const uploader = new PineconeUploader(apiKey);
uploader.processAndUploadFiles();
