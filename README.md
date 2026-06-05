# Combined IT Digital Card Frontend

React + Vite frontend for the Combined IT digital business card and product dashboard.

## Requirements

- Node.js 20 or newer
- npm
- Firebase project credentials
- Running backend API, either locally or deployed

## Local Setup

1. Clone the repository.

```bash
git clone https://github.com/zabirarkam27/combinedit-project-zarif.git
cd combinedit-project-zarif
```

2. Install dependencies.

```bash
npm install
```

3. Create the local environment file.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Fill in `.env`.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000

VITE_ADMIN_GMAIL=
VITE_ADMIN_EMAIL=
```

5. Start the dev server.

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

## Backend

For local development, run the backend from:

```text
https://github.com/zabirarkam27/combinedit-project-zarif-server
```

Set `VITE_API_BASE_URL=http://localhost:5000` when using the local backend.

For production, set `VITE_API_BASE_URL` to the deployed backend URL.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deployment

This project is configured for Vercel as a single-page app. The `vercel.json` rewrite sends all routes to `index.html`, so dashboard routes work after refresh.

## Security Notes

- Do not commit `.env`.
- Use `.env.example` only for placeholder keys.
- Rotate credentials if a real secret was ever committed to Git history.
