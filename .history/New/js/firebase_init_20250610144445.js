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

// Firebase アプリが初期化された後に実行される処理
firebase.auth().onAuthStateChanged(function(user) {
  console.log('Firebase app initialized and auth service ready.');

  // ここに、Firebase 初期化後に実行したい他のスクリプトの初期化コードや関数呼び出しを記述
  // 例:
  // initializeRegister(); // register.js の初期化関数
  // initializeLogin(); // login.js の初期化関数
  // chatSystem.init(); // chat_system.js の初期化関数
});

window.firebaseAuth = firebase.auth();
window.googleProvider = new firebase.auth.GoogleAuthProvider();
