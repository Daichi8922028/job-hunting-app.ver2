// login.js: テスト開発用（認証スキップ）＋本来の認証コードをコメントで併記

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = loginForm.elements['email'].value;
      const password = loginForm.elements['password'].value;

      try {
        const userCred = await firebaseAuth.signInWithEmailAndPassword(email, password);
        localStorage.setItem('firebaseUid', userCred.user.uid);
        showScreen('home-screen');
      } catch (err) {
        alert('メールアドレスまたはパスワードが違います');
      }
    });
  }

  const googleBtn = document.getElementById('google-login');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      try {
        const result = await firebaseAuth.signInWithPopup(googleProvider);
        localStorage.setItem('firebaseUid', result.user.uid);
        showScreen('home-screen');
      } catch (err) {
        alert(err.message);
      }
    });
  }
});

// 新規登録画面に切り替え
function showRegisterScreen() {
  showScreen('register-screen');
}
