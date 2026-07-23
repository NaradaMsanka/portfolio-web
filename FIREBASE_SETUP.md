# Firebase setup

## Simple setup

1. In the Firebase console, create a project.
2. Add a Web App and copy the web config object.
3. Run:

```powershell
npm run firebase:setup
```

4. Paste the config when prompted. This creates `.env` and can also create `.firebaserc`.
5. Create a Cloud Firestore database.
6. Run the app locally:

```powershell
npm run dev
```

The public site can read published Firestore content after `.env` is configured. If `.env` is missing, the site uses the local fallback content.

## Firestore and Render

1. Install the Firebase CLI and sign in:

```powershell
npm install -g firebase-tools
firebase login
```

2. If you did not create `.firebaserc` with the setup command, select the project.

```powershell
firebase use --add
```

3. Deploy only Firestore rules.

```powershell
npm run deploy:firestore-rules
```

4. In Firebase Console, generate a service-account private key from Project Settings > Service accounts.
5. Store the service-account values in Render environment variables:

```dotenv
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

6. Follow `ADMIN_SETUP.md` for administrator and Cloudinary variables.

Enquiries and admin writes are validated by the server API. Browser clients have no direct write access to Firestore.
