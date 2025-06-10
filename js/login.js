// login.js: テスト開発用（認証スキップ）＋本来の認証コードをコメントで併記

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // ------ テスト用：何を入力してもホーム画面へ進む ------
      showScreen('home-screen');

      /* ------ 本来の認証処理（DB連携/LocalStorage用） ------
      const email = loginForm.elements['email'].value;
      const password = loginForm.elements['password'].value;
      // 例：localStorageから値を取得して認証
      if (
        email === localStorage.getItem('userEmail') &&
        password === localStorage.getItem('userPassword')
      ) {
        showScreen('home-screen');
      } else {
        alert('メールアドレスまたはパスワードが違います');
      }
      // ------ 本来の認証ここまで ------
      */
    });
  }
});

// 新規登録画面に切り替え
function showRegisterScreen() {
  showScreen('register-screen');
}
