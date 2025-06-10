// firebase_init.js: Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6PqvIGF2GIyCWOg6Wx-dQXq1fJCnKRD8",
  authDomain: "jobhuntingappver2.firebaseapp.com",
  projectId: "jobhuntingappver2",
  storageBucket: "jobhuntingappver2.firebasestorage.app",
  messagingSenderId: "471354047507",
  appId: "1:471354047507:web:7f1ff914d98428197353e6",
  measurementId: "G-TG93P2MQG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
