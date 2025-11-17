# OTP Finder

An Express.js application that uses OpenAI's ChatGPT API to detect and extract OTP (One-Time Password) codes from text.

## Features

- Simple web interface with a text input box
- AI-powered OTP detection using Google Gemini
- Clean and responsive UI design
- REST API endpoint for OTP extraction
- Automatic regex fallback if API fails

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Get your free Google Gemini API key from:
   ```
   https://aistudio.google.com/app/apikey
   ```

4. Add your Google API key to the `.env` file:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Paste text containing an OTP code into the input box and click "Find OTP"

## API Endpoint

### POST /api/find-otp

Analyzes text to find OTP codes.

**Request Body:**
```json
{
  "text": "Your verification code is 123456"
}
```

**Response (OTP found):**
```json
{
  "status": true,
  "otp": "123456"
}
```

**Response (No OTP):**
```json
{
  "status": false
}
```

## Tech Stack

- Node.js
- Express.js
- Google Gemini API (gemini-1.5-flash)
- HTML/CSS/JavaScript (Vanilla)
