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

/**
 * Firebase Authenticationのエラーコードを日本語メッセージに変換します。
 * @param {object} error - Firebase Authenticationから返されるエラーオブジェクト
 * @returns {string} 日本語のエラーメッセージ
 */
export function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。';
    case 'auth/user-disabled':
      return 'このユーザーアカウントは無効化されています。';
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません。メールアドレスを確認してください。';
    case 'auth/wrong-password':
      return 'パスワードが間違っています。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。';
    case 'auth/operation-not-allowed':
      return 'メール/パスワード認証が有効になっていません。';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます。より強力なパスワードを使用してください。';
    case 'auth/popup-closed-by-user':
      return '認証ポップアップがユーザーによって閉じられました。';
    case 'auth/cancelled-popup-request':
        return '既に認証ポップアップが開かれています。';
    case 'auth/operation-not-supported-in-this-environment':
        return 'この環境では操作がサポートされていません。サードパーティ認証を使用している場合、httpではなくhttpsを使用していることを確認してください。';
    case 'auth/auth-domain-config-required':
        return '現在のドメインは認証に使用されていません。';
    case 'auth/credential-already-in-use':
        return 'この認証情報は既に別のアカウントで使用されています。';
    default:
      console.error('未知のFirebase Authエラー:', error);
      return '認証中に不明なエラーが発生しました。時間をおいて再度お試しください。';
  }
}
