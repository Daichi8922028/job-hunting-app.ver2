// login.js: テスト開発用（認証スキップ）＋本来の認証コードをコメントで併記

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = loginForm.elements['email'].value;
      const password = loginForm.elements['password'].value;

    });
  }
});

// 新規登録画面に切り替え
function showRegisterScreen() {
  showScreen('register-screen');
}
