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
4. Copy the same values into `.env` if you plan to load them via `load_env.js`.

### Google AI (Gemini)

1. Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
2. Obtain a Gemini API key from [Google&nbsp;AI Studio](https://aistudio.google.com/app/apikey) or the Google Cloud console and add it to the `.env` file:
   ```bash
   echo "GEMINI_API_KEY=<your_key>" >> .env
   ```
3. The key is used by `New/js/ai_api.js` and `New/js/config.js` to connect to the Gemini API.

### Environment Loader

`load_env.js` reads the values from `.env` and exposes them as `window.env` for the client code. This file is listed in `.gitignore` and should not be committed.

## Running the Application

This project is a static web app. Serve the `New` directory with any static file server.
Example using `http-server`:

```bash
npx http-server New
```

Then open `http://localhost:8080/html/index.html` in your browser.

