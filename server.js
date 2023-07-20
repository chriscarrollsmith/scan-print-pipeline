const express = require('express');
const app = express();
const path = require('path');
const whisperRouter = require('./api/whisper');

// ... Other server configurations ...

app.use(express.json());

// API Routes
app.use('/api/whisper', whisperRouter);

// Serve the React app (if it's built and placed in the 'build' folder)
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
