// login.js: テスト開発用（認証スキップ）＋本来の認証コードをコメントで併記
import { login } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = loginForm.elements['email'].value;
      const password = loginForm.elements['password'].value;
      try {
        const cred = await login(email, password);
        localStorage.setItem('firebaseUid', cred.user.uid);
        showScreen('home-screen');
      } catch (err) {
        alert('ログインに失敗しました: ' + err.message);
      }
    });
  }
});

// Googleログインボタンのイベントリスナー
const googleLoginButton = document.getElementById('google-login');
if (googleLoginButton) {
  googleLoginButton.addEventListener('click', async function() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      alert('Googleログイン成功！');
      // ログイン成功後の画面遷移など
      showScreen('home-screen'); // 例: ホーム画面へ遷移
    } catch (error) {
      alert('Googleログインに失敗しました: ' + error.message);
      console.error('Googleログインエラー:', error);
    }
  });
}


// 新規登録画面に切り替え
function showRegisterScreen() {
  showScreen('register-screen');
}
