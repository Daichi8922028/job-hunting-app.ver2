# Job Hunting App

This application is a simple front-end project that uses Firebase for authentication/storage and the Google AI (Gemini) API for AI responses.

## Installation

1. Install **Node.js** (version 18 or later recommended).
2. Install the project dependencies:
   ```bash
   npm install
   ```

## Configuration

### Firebase

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Obtain your project's configuration snippet (API key, auth domain, etc.).
3. Replace the placeholder values in the following files with your actual Firebase config:
   - `New/js/firebase.js`
   - `New/js/firebase_init.js`

### Google AI (Gemini)

1. Copy `.env.example` to `.env` and set your API key:
   ```bash
   cp .env.example .env
   echo "GEMINI_API_KEY=<your_key>" >> .env
   ```
2. The key is used by `New/js/ai_api.js` and `New/js/config.js` for connecting to the Gemini API.

## Running the Application

This project is a static web app. Serve the `New` directory with any static file server.
Example using `http-server`:

```bash
npx http-server New
```

Then open `http://localhost:8080/html/index.html` in your browser.

