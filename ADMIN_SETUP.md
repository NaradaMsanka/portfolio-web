# Aventro administrator setup

The dashboard is available at `/admin` and uses one administrator account configured through backend environment variables. Passwords and session tokens are never stored in browser storage.

## Install

```powershell
npm install
npm --prefix functions install
```

## Generate credentials

Generate a bcrypt password hash. The password is hidden while you type and is never written to a file:

```powershell
npm run admin:hash-password
```

Generate a separate session-signing secret:

```powershell
npm run admin:generate-session-secret
```

Keep both outputs private. Do not put the raw password, password hash, or session secret in Git, Firestore, browser storage, or a `VITE_` variable.

## Configure Render environment

Set these administrator variables in Render:

```dotenv
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=your-generated-password-hash
ADMIN_SESSION_SECRET=your-random-session-secret
```

- `ADMIN_USERNAME`: the administrator username you choose.
- `ADMIN_PASSWORD_HASH`: output from `npm run admin:hash-password`.
- `ADMIN_SESSION_SECRET`: output from `npm run admin:generate-session-secret`.

Set these Cloudinary variables in Render:

```dotenv
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never put `CLOUDINARY_API_SECRET` in React code, `.env` variables with `VITE_`, or any public client-side upload preset. Image uploads are signed through the backend.

Set the Firestore service-account variables described in `FIREBASE_SETUP.md`.

## Run locally

Set the same backend variables in your shell, then run:

```powershell
npm run build
npm start
```

Open `http://127.0.0.1:3000/admin`. Use the username you configured and the original password used to create the bcrypt hash.

## Deploy on Render

Use `npm install && npm --prefix functions install && npm run build` as the build command.
Use `npm start` as the start command.

## Security behavior

- Login attempts are rate limited.
- Sessions are stored privately in Firestore and expire after eight hours.
- The browser receives only an `HttpOnly`, `SameSite=Strict` cookie.
- Every admin list, write, delete, and upload request validates the server session.
- Firestore rules continue to deny direct browser writes.
- Images are uploaded and deleted through Cloudinary using backend credentials only.

For automatic document cleanup, a Firestore TTL policy can be enabled on `adminSessions.expiresAt`. Session validation does not rely on TTL; expired sessions are rejected by the API.
