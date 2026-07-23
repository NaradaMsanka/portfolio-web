# Firebase setup

1. Create a Firebase project and add a Web App in the Firebase console.
2. Create a Cloud Firestore database.
3. Copy the Firebase Web App placeholders from `.env.example` into `.env` and replace them with the Web App configuration values.
4. Install the Firebase CLI and sign in: `npm install -g firebase-tools` then `firebase login`.
5. Select the project: `firebase use --add`.
6. Follow `ADMIN_SETUP.md` to generate the administrator credentials and configure the private Cloud Functions secrets.
7. Deploy the Firestore and Storage rules: `firebase deploy --only firestore:rules,storage`.
8. Build and deploy the site and API: `npm run build` then `firebase deploy --only functions,hosting`.

Enquiries are validated and written by the server API. Browser clients have no direct write access to Firestore or Storage. See `ADMIN_SETUP.md` for authentication, local testing, and deployment details.
