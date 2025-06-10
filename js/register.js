// register.js: 新規登録処理＋ヒアリング開始
document.addEventListener('DOMContentLoaded', () => {
  // 新規登録フォームの送信イベント
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // 入力値取得
      const email = regForm.elements['email'].value;
      const password = regForm.elements['password'].value;
      // 仮でlocalStorage保存
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      // 登録フォーム非表示、ヒアリング質問表示
      regForm.style.display = 'none';
      showQuestions();
    });
  }

  // ヒアリング送信ボタン
  const qSubmit = document.getElementById('questions-submit');
  if (qSubmit) {
    qSubmit.addEventListener('click', () => {
      // ここで回答データをまとめてlocalStorage等に保存（後でDB連携予定）
      const area = document.getElementById('questions-area');
      const answers = [];
      Array.from(area.querySelectorAll('input')).forEach(input => {
        answers.push(input.value);
      });
      localStorage.setItem('questions', JSON.stringify(answers));
      // ホーム画面へ遷移
      showScreen('home-screen');
    });
  }
});

// ヒアリング質問の表示
function showQuestions() {
  const questions = [
    "現在の学年を教えてください",
    "志望業界は決まっていますか？",
    "エントリーシート提出経験はありますか？",
    "面接・GDなどの選考経験はありますか？",
    "就活で今一番困っていることは何ですか？"
  ];
  const area = document.getElementById('questions-area');
  if (!area) return;
  area.innerHTML = '';
  questions.forEach((q, idx) => {
    area.innerHTML += `<label>${q}<input type="text" name="q${idx}" required></label><br>`;
  });
  document.getElementById('register-questions').style.display = 'block';
  document.getElementById('questions-submit').style.display = 'inline-block';
}

// ログイン画面に切り替え
function showLoginScreen() {
  showScreen('login-screen');
}
