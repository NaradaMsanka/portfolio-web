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

Create a Gmail App Password for `suneth2003narada@gmail.com`, then store it as a Firebase secret. Do not use the normal Gmail password:

```powershell
firebase functions:secrets:set GMAIL_APP_PASSWORD
```

The Firebase project must be on the Blaze plan to deploy Cloud Functions. Build and deploy Firebase Hosting, Firestore rules, and the email notification function with:

```powershell
npm run deploy
```

The browser uses Firebase Authentication for the administrator session, Firestore for content and enquiries, and Cloudinary for image uploads. A Firestore-triggered Cloud Function emails each new enquiry to `suneth2003narada@gmail.com`; the Gmail App Password remains server-side in Firebase Secret Manager.
