const firebaseConfig = {
  apiKey: window.env.FIREBASE_API_KEY, // 修正
  authDomain: window.env.FIREBASE_AUTH_DOMAIN, // 修正
  projectId: window.env.FIREBASE_PROJECT_ID, // 修正
  storageBucket: window.env.FIREBASE_STORAGE_BUCKET, // 修正
  messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID, // 修正
  appId: window.env.FIREBASE_APP_ID, // 修正
  measurementId: window.env.FIREBASE_MEASUREMENT_ID // .env.exampleに追加したのでここにも追加
};

// Firebase SDKを初期化
firebase.initializeApp(firebaseConfig);
window.firebaseAuth = firebase.auth();
window.googleProvider = new firebase.auth.GoogleAuthProvider();
