# Firebase setup

1. Create a Firebase project and add a Web App in the Firebase console.
2. Create a Cloud Firestore database.
3. Copy `.env.example` to `.env` and replace every placeholder with the Web App configuration values.
4. Install the Firebase CLI and sign in: `npm install -g firebase-tools` then `firebase login`.
5. Select the project: `firebase use --add`.
6. Deploy the Firestore rules: `firebase deploy --only firestore:rules`.
7. Build and deploy the site: `npm run build` then `firebase deploy --only hosting`.

Enquiries are written to the `enquiries` collection. The included rules allow validated creates from the form and deny public reads, updates, and deletes. Before a public launch, enable Firebase App Check enforcement for Cloud Firestore to reduce automated abuse.
