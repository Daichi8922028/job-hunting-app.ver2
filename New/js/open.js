// open.js: オープン画面の美しい表示＋2秒後に登録画面へ遷移

window.addEventListener('DOMContentLoaded', () => {
  // すべての画面を非表示＋オープン画面だけ表示
  showScreen('open-screen');

  // オープン画面にフェードイン用クラス追加（演出）
  const openEl = document.getElementById('open-screen');
  if (openEl) {
    openEl.classList.add('fade-in-screen');
  }

  // 4秒後に登録画面へフェードアウト/フェードインで遷移
  setTimeout(() => {
    showScreenWithTransition('open-screen', 'register-screen');
  }, 4000);
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
    if (el) el.style.display = (id === screenId) ? 'flex' : 'none';
  });
}

// フェードアウト/フェードインで画面遷移する関数
function showScreenWithTransition(fromScreenId, toScreenId, delay = 500) {
  const fromEl = document.getElementById(fromScreenId);
  const toEl = document.getElementById(toScreenId);
  
  // フェードアウト開始
  if (fromEl) {
    fromEl.classList.add('fade-out-screen');
  }
  
  // フェードアウト完了後にフェードイン開始
  setTimeout(() => {
    // 全画面を隠す
    showScreen(toScreenId);
    
    // 新しい画面をフェードインで表示
    if (toEl) {
      toEl.classList.add('screen-transition');
      toEl.style.display = 'flex';
      
      // 少し遅らせてフェードイン効果を開始
      setTimeout(() => {
        toEl.classList.add('fade-in');
      }, 50);
    }
    
    // 前の画面のクラスをクリーンアップ
    if (fromEl) {
      fromEl.classList.remove('fade-out-screen', 'fade-in-screen');
    }
  }, delay);
}

