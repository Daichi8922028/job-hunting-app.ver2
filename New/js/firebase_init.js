// firebase_init.js: Firebase configuration and initialization
// Replace the placeholder values with your Firebase project settings

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sign in anonymously to obtain a UID
firebase.auth().signInAnonymously().catch(err => {
  console.error('Firebase Auth Error:', err);
});

// Expose the Firestore instance and current user UID
document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      window.firebaseUserId = user.uid;
      window.db = db;
    }
  });
});
