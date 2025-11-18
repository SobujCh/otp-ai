require('dotenv').config();
const express = require('express');
const path = require('path');

// Import the DigitalOcean function for local testing
const { main: findOtpFunction } = require('./packages/otp-finder/find-otp/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Local Express wrapper for the DigitalOcean function
app.post('/api/find-otp', async (req, res) => {
  try {
    // Prepare args in DigitalOcean function format
    const args = {
      text: req.body.text,
      apiKey: req.body.apiKey,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      API_KEY: process.env.API_KEY
    };

    // Call the DigitalOcean function
    const result = await findOtpFunction(args);

    // Send response
    res.status(result.statusCode || 200).json(result.body);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Local test server running on http://localhost:${PORT}`);
  console.log('This wraps the DigitalOcean function for local testing');
});
