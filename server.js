require('dotenv').config();
const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to find OTP
app.post('/api/find-otp', async (req, res) => {
  try {
    let { text } = req.body;

    // Trim the text
    text = text ? text.trim() : '';

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an OTP extraction expert. Analyze the following SMS text and extract ONLY the OTP/verification code.

CRITICAL RULES:
1. Return ONLY valid JSON format - no markdown, no explanation, no extra text
2. Look for codes near keywords: "OTP", "verification", "code", "password", "verify", "authenticate", "confirm"
3. IGNORE: phone numbers, application numbers, file numbers, reference IDs, dates, prices
4. OTP formats to look for: 4-8 digits OR 4-8 alphanumeric characters (case-sensitive)
5. If multiple codes exist, prioritize the one closest to OTP-related keywords

REQUIRED JSON RESPONSE FORMAT:
{
  "status": true,
  "otp": "the extracted code only"
}

OR if no OTP found:
{
  "status": false
}

SMS TEXT TO ANALYZE:
${text}

Remember: Return ONLY the JSON object with status and otp fields, nothing else.`;

    // Call Google Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt
    });

    const responseText = response.text;
    
    console.log('Raw AI response:', responseText); // Debug log
    
    // Try to parse JSON from the response
    let jsonResponse;
    try {
      // Clean up the response text - remove markdown code blocks if present
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Attempted to parse:', responseText);
      
      // Try to extract JSON manually
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          jsonResponse = JSON.parse(jsonMatch[0]);
        } catch {
          // If still failing, return a safe default
          jsonResponse = { 
            status: false, 
            error: 'Failed to parse AI response',
            rawResponse: responseText 
          };
        }
      } else {
        jsonResponse = { 
          status: false, 
          error: 'No valid JSON found in response',
          rawResponse: responseText 
        };
      }
    }
    
    res.json(jsonResponse);

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
  console.log(`Server is running on http://localhost:${PORT}`);
});
