// open.js: オープン画面から登録または自動ログイン画面へ2秒後に遷移

window.addEventListener('DOMContentLoaded', () => {
  // 最初にオープン画面だけ表示
  showScreen('open-screen');

  // 2秒後に新規登録 or 自動ログインへ
  setTimeout(() => {
    // （ここでローカルストレージ等で自動ログイン判定してもOK）
    // ひとまず登録画面に遷移
    showScreen('register-screen');
  }, 2000);
});

// 共通の画面切り替え関数
function showScreen(screenId) {
  const screens = [
    'open-screen', 'register-screen', 'login-screen',
    'home-screen', 'analysis-self-screen',
    'analysis-company-screen', 'analysis-industry-screen'
  ];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === screenId) ? 'block' : 'none';
  });
}
