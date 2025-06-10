const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID // .env.exampleに追加したのでここにも追加
};

// Firebase SDKを初期化
// firebase.initializeApp(firebaseConfig); // 既に初期化されている可能性があるのでコメントアウト
// window.firebaseAuth = firebase.auth(); // 同上
// window.googleProvider = new firebase.auth.GoogleAuthProvider(); // 同上
