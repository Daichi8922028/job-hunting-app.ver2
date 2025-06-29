// register.js: 新規登録処理＋学年・志望業界のドロップダウンを動的に生成
import { signUp } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired in register.js'); // 追加

  // パスワード入力時のリアルタイムバリデーション
  const passwordInput = document.getElementById('register-password');
  console.log('passwordInput element:', passwordInput); // 追加

  if (passwordInput) {
    passwordInput.addEventListener('input', validatePassword);
    console.log('input event listener added to passwordInput'); // 追加
  }

  // 新規登録フォームの送信イベント
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // 入力値取得
      const email = regForm.elements['email'].value;
      const password = regForm.elements['password'].value;

      // パスワードバリデーション
      if (!isValidPassword(password)) {
        alert('パスワードが要件を満たしていません。8文字以上で英字と数字を含む必要があります。');
        return;
      }

      try {
        const cred = await signUp(email, password);
        localStorage.setItem('firebaseUid', cred.user.uid);
        showDropdownQuestions();
      } catch (err) {
        alert('登録に失敗しました: ' + err.message);
      }
    });
  }

  // ヒアリング送信ボタン
  const qSubmit = document.getElementById('questions-submit');
  if (qSubmit) {
    qSubmit.addEventListener('click', () => {
      const grade = document.getElementById('q-grade').value;
      const industry = document.getElementById('q-industry').value;

      if (!grade || !industry) {
        alert('すべて選択してください');
        return;
      }

      const uid = localStorage.getItem('firebaseUid') || '';
      const answers = { grade, industry };
      localStorage.setItem(`personalizedAnswers_${uid}`, JSON.stringify(answers));
      showScreen('home-screen');
    });
  }

  // Google新規登録ボタンのイベントリスナー
  const googleRegisterButton = document.getElementById('google-register');
  if (googleRegisterButton) {
    googleRegisterButton.addEventListener('click', async function() {
      // Firebase Authが利用可能か確認
      if (!window.firebaseAuth) { // 追加
        alert('Firebase認証サービスがまだ利用できません。時間をおいて再度お試しください。'); // 追加
        console.error('Firebase Auth not available yet.'); // 追加
        return; // 追加
      } // 追加

      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        // window.firebaseAuth を使用するように修正 (より安全)
        const result = await window.firebaseAuth.signInWithPopup(provider); // 修正
        const user = result.user; // 追加：ユーザー情報を取得
        console.log('Google新規登録成功！User:', user); // 修正：ログ出力にユーザー情報を含める
        alert('Google新規登録成功！');
        // 新規登録成功後の画面遷移など
        showDropdownQuestions(); // 例: ヒアリング画面へ遷移
      } catch (error) {
        alert('Google新規登録に失敗しました: ' + error.message);
        console.error('Google新規登録エラー:', error);
      }
    });
  }
});

// 学年・志望業界のドロップダウンを動的生成
function showDropdownQuestions() {
  const area = document.getElementById('questions-area');
  if (!area) return;
  area.innerHTML = `
    <div class="form-group">
      <label for="q-grade">学年</label>
      <select id="q-grade" class="form-select" required>
        <option value="">選択してください</option>
        <option value="3年">学部3年</option>
        <option value="4年">学部4年</option>
        <option value="院1年">院1年</option>
        <option value="院2年">院2年</option>
        <option value="その他">その他</option>
      </select>
    </div>

    <div class="form-group">
      <label for="q-industry">志望業界</label>
      <select id="q-industry" class="form-select" required>
        <option value="">選択してください</option>
        <option value="未定">未定</option>
        <option value="コンサル">コンサル</option>
        <option value="IT">IT</option>
        <option value="メーカー">メーカー</option>
        <option value="商社">商社</option>
        <option value="金融">金融</option>
        <option value="その他">その他</option>
      </select>
    </div>
  `;
  document.getElementById('register-questions').style.display = 'block';
  document.getElementById('questions-submit').style.display = 'inline-block';
}

// パスワードバリデーション関数
function isValidPassword(password) {
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  return minLength && hasLetter && hasNumber;
}

// リアルタイムパスワードバリデーション
function validatePassword() {
  const password = document.getElementById('register-password').value;
  const lengthCheck = document.getElementById('length-check');
  const letterCheck = document.getElementById('letter-check');
  const numberCheck = document.getElementById('number-check');

  // 文字数チェック
  if (password.length >= 8) {
    lengthCheck.textContent = '✓ 8文字以上';
    lengthCheck.classList.add('valid');
  } else {
    lengthCheck.textContent = '✗ 8文字以上';
    lengthCheck.classList.remove('valid');
  }

  // 英字チェック
  if (/[a-zA-Z]/.test(password)) {
    letterCheck.textContent = '✓ 英字を含む';
    letterCheck.classList.add('valid');
  } else {
    letterCheck.textContent = '✗ 英字を含む';
    letterCheck.classList.remove('valid');
  }

  // 数字チェック
  if (/\d/.test(password)) {
    numberCheck.textContent = '✓ 数字を含む';
    numberCheck.classList.add('valid');
  } else {
    numberCheck.textContent = '✗ 数字を含む';
    numberCheck.classList.remove('valid');
  }
}

// ログイン画面に切り替え
function showLoginScreen() {
  showScreen('login-screen');
}

// グローバルスコープに公開
window.showLoginScreen = showLoginScreen;
