# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## How to run it

1. (First time only) Install dependencies:
   ```
   npm install
   ```
2. Start the server:
   ```
   npm start
   ```
3. Open your browser to http://localhost:3000

Or just ask Claude to `/harness-pipeline:run` it.

## How it's organized
- `server.js` — the backend server (serves the site, handles requests, can save data)
- `public\` — the front-end files the browser shows (`index.html`, `style.css`, `script.js`)
- `package.json` — the list of dependencies and the start command
