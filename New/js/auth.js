// auth.js: Firebase Authentication helper functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    alert('ユーザー登録成功！');
    return userCredential;
  } catch (error) {
    alert('エラー: ' + error.message);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    alert('ログイン成功！');
    return userCredential;
  } catch (error) {
    alert('エラー: ' + error.message);
    throw error;
  }
}

export async function logout() {
  await signOut(firebaseAuth);
  alert('ログアウトしました');
}

// expose globally for non-module scripts
window.signUp = signUp;
window.login = login;
window.logout = logout;
