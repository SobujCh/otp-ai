# OTP Finder - DigitalOcean Function

An AI-powered OTP extraction service with API key authentication, deployable as a DigitalOcean Function.

## Features

- 🔐 **API Key Authentication** - Secure access control
- 🤖 **AI-Powered** - Uses Google Gemini for smart OTP detection
- ☁️ **Serverless** - Runs as a DigitalOcean Function
- 💰 **Cost-effective** - Pay only for usage
- 🎨 **Web UI** - Simple interface for testing
- 🔧 **Local Testing** - Express wrapper for development

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install
cd packages/otp-finder && npm install && cd ../..

# Create .env file
cp .env.example .env
```

### 2. Configure Environment

Edit `.env`:
```env
GOOGLE_API_KEY=your_google_api_key_here
API_KEY=your_secure_api_key_here
PORT=3000
```

Get Google API key: https://aistudio.google.com/app/apikey

### 3. Test Locally

```bash
npm start
```

Visit http://localhost:3000

- Paste SMS text in textarea
- Enter your API key from `.env`
- Click "Find OTP"

## Deploy to DigitalOcean

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

### Quick Deploy

```bash
# Install doctl
brew install doctl  # macOS
# or download from https://github.com/digitalocean/doctl/releases

# Authenticate
doctl auth init

# Connect to Functions
doctl serverless connect

# Set environment variables
doctl serverless functions config create GOOGLE_API_KEY "your_key"
doctl serverless functions config create API_KEY "your_api_key"

# Deploy
doctl serverless deploy . --remote-build

# Get URL
doctl serverless functions list
```

Your function will be available at:
```
https://faas-xxx.doserverless.co/api/v1/web/fn-xxx/otp-finder/find-otp
```

## API Endpoint

### Request
```
POST /api/find-otp
Content-Type: application/json

{
  "text": "Your verification code is 123456"
}
```

### Response (OTP Found - Regex)
```json
{
  "status": true,
  "otp": "123456",
  "source": "regex"
}
```

### Response (OTP Found - AI)
```json
{
  "status": true,
  "otp": "pv6HMJM",
  "source": "ai"
}
```

### Response (No OTP)
```json
{
  "status": false
}
```

## How It Works

1. **Regex Patterns (First)** - Tries 15+ optimized patterns:
   - Keyword-based: "OTP", "verification", "code", etc.
   - Numeric: 4-8 digit codes
   - Alphanumeric: Mixed case codes
   - With delimiters: quotes, brackets, colons

2. **AI Fallback (If needed)** - When regex fails:
   - Calls Google Gemini API
   - Smart prompt engineering
   - Returns structured JSON

3. **Validation** - Filters false positives:
   - Phone numbers
   - Dates (years)
   - Reference IDs
   - Common words

## Performance

- **Regex**: ~50ms response time (95% of cases)
- **AI**: ~500ms response time (5% of cases)
- **Cost**: Minimal - most requests use free regex

## Tech Stack

- **Runtime**: Node.js 20
- **AI**: Google Gemini (gemini-2.5-flash-lite)
- **Platform**: DigitalOcean Functions
- **Local Testing**: Express.js
- **UI**: Vanilla HTML/CSS/JavaScript

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
