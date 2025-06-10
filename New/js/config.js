// config.js: アプリケーション設定

const AppConfig = {
  // Google AI Studio API設定
  ai: {
    // Google AI Studio APIキー
    // 環境変数 GEMINI_API_KEY を参照し、未設定の場合はプレースホルダーを使用
    apiKey: process.env.GEMINI_API_KEY || 'YOUR_GOOGLE_AI_STUDIO_API_KEY',
    
    // APIが無効の場合はフォールバック応答を使用
    enableFallback: true,
    
    // レスポンス生成の設定
    generation: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxTokens: 1024
    }
  },
  
  // チャット履歴の設定
  chat: {
    maxHistoryItems: 50, // 保存する最大履歴数
    autosave: true, // 自動保存を有効にする
    storageKey: 'jobHuntingApp_chatHistory'
  },
  
  // UI設定
  ui: {
    animationDuration: 300,
    typingDelay: {
      min: 1000,
      max: 3000
    },
    sidebarWidth: 280
  }
};

// APIキーを設定する関数
function setApiKey(apiKey) {
  AppConfig.ai.apiKey = apiKey;
  if (window.aiApiService) {
    window.aiApiService.setApiKey(apiKey);
  }
  localStorage.setItem('jobHuntingApp_apiKey', apiKey);
}

// 保存されたAPIキーを読み込む関数
function loadSavedApiKey() {
  const savedKey = localStorage.getItem('jobHuntingApp_apiKey');
  if (savedKey && savedKey !== 'YOUR_GOOGLE_AI_STUDIO_API_KEY') {
    setApiKey(savedKey);
  }
}

// APIキー設定ダイアログを表示する関数
function showApiKeyDialog() {
  const modal = document.createElement('div');
  modal.className = 'api-key-modal';
  modal.innerHTML = `
    <div class="api-key-dialog">
      <h3>Google AI Studio APIキー設定</h3>
      <p>より高品質な AI 応答を利用するために、Google AI Studio APIキーを設定してください。</p>
      <div class="form-group">
        <label for="api-key-input">APIキー:</label>
        <input type="password" id="api-key-input" placeholder="APIキーを入力してください">
      </div>
      <div class="api-key-buttons">
        <button onclick="closeApiKeyDialog()" class="btn-secondary">キャンセル</button>
        <button onclick="saveApiKey()" class="btn-primary">保存</button>
      </div>
      <div class="api-key-help">
        <p><small>
          <a href="https://makersuite.google.com/app/apikey" target="_blank">
            Google AI Studio でAPIキーを取得
          </a>
        </small></p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeApiKeyDialog();
    }
  });
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  const apiKey = input.value.trim();
  
  if (apiKey) {
    setApiKey(apiKey);
    closeApiKeyDialog();
    alert('APIキーが保存されました。より高品質な AI 応答をお楽しみください！');
  } else {
    alert('APIキーを入力してください。');
  }
}

function closeApiKeyDialog() {
  const modal = document.querySelector('.api-key-modal');
  if (modal) {
    modal.remove();
  }
}

// 初期化時にAPIキーを読み込み
document.addEventListener('DOMContentLoaded', () => {
  loadSavedApiKey();
});

// グローバルに公開
window.AppConfig = AppConfig;
window.setApiKey = setApiKey;
window.showApiKeyDialog = showApiKeyDialog;
window.saveApiKey = saveApiKey;
window.closeApiKeyDialog = closeApiKeyDialog;