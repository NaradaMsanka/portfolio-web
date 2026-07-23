# Aventro administrator setup

The dashboard is available at `/admin` and uses one administrator account configured through private Firebase secrets. Passwords and session tokens are never stored in browser storage.

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

## Configure Firebase

After installing the Firebase CLI and selecting the project, set these three Cloud Functions secrets:

```powershell
firebase functions:secrets:set ADMIN_USERNAME
firebase functions:secrets:set ADMIN_PASSWORD_HASH
firebase functions:secrets:set ADMIN_SESSION_SECRET
```

- `ADMIN_USERNAME`: the administrator username you choose.
- `ADMIN_PASSWORD_HASH`: output from `npm run admin:hash-password`.
- `ADMIN_SESSION_SECRET`: output from `npm run admin:generate-session-secret`.

For local emulators only, create the ignored file `functions/.secret.local`:

```dotenv
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD_HASH=your-generated-password-hash
ADMIN_SESSION_SECRET=your-random-session-secret
```

## Run locally

```powershell
npm run build
npm run emulators
```

Open `http://127.0.0.1:5000/admin`. Use the username you configured and the original password used to create the bcrypt hash.

## Deploy

```powershell
firebase deploy --only firestore:rules,storage
npm run build
firebase deploy --only functions,hosting
```

## Security behavior

- Login attempts are rate limited.
- Sessions are stored privately in Firestore and expire after eight hours.
- The browser receives only an `HttpOnly`, `SameSite=Strict` cookie.
- Every admin list, write, delete, and upload request validates the server session.
- Firestore and Storage rules continue to deny direct browser writes.

For automatic document cleanup, a Firestore TTL policy can be enabled on `adminSessions.expiresAt`. Session validation does not rely on TTL; expired sessions are rejected by the API.
