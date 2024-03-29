const express = require('express');
// const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Add body-parser middleware to parse JSON in the request body
app.use(bodyParser.json({ limit: '50mb' }));

// Define a route handler for the home route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/predict', async (req, res) => {
    try {
      // Get the uploaded image file from req.file
      const { image } = req.body;
  
      // Make an API request using axios with the uploaded image data
      const apiResponse = await axios.post('http://127.0.0.1:5000/predict', {
        image
      });
  
      // Return the response from the API as the response to the client
      res.json(apiResponse.data);
    } catch (error) {
      // Handle errors
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
