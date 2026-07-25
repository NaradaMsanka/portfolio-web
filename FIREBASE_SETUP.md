# Firebase setup

1. Create a Firebase project, register a Web App, and create a Cloud Firestore database.
2. Enable Email/Password authentication and create the administrator account.
3. Replace `YOUR_ADMIN_UID` in `firestore.rules` with the account UID from Firebase Authentication.
4. Copy `.env.example` to `.env` and provide the Firebase Web App and Cloudinary unsigned-upload values.
5. Install the Firebase CLI, sign in, and select the Firebase project:

```powershell
npm install -g firebase-tools
firebase login
firebase use --add
```

Run the app locally with:

```powershell
npm run dev
```

Build and deploy Firebase Hosting and Firestore rules with:

```powershell
npm run deploy
```

The browser uses Firebase Authentication for the administrator session, Firestore for content and enquiries, and Cloudinary for image uploads.
