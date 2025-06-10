// chat_system.js: ChatGPTライクなチャットシステム

class ChatSystem {
  constructor() {
    this.currentChatType = null;
    this.currentChatId = null;
    this.chatHistory = {
      self: [],
      company: [],
      industry: []
    };
    this.isTyping = false;
    this.init();
  }  init() {
    // チャット履歴をローカルストレージから読み込み
    this.loadChatHistory();
    
    // チャットセッションをローカルストレージから読み込み
    this.loadChatSessions();
    
    // 各分析画面のイベントリスナーを設定
    this.setupEventListeners();
    
    // テキストエリアの自動リサイズ機能
    this.setupAutoResize();
    
    // サイドバー履歴を初期化
    this.initializeSidebarHistory();
  }

  setupEventListeners() {
    const chatTypes = ['self', 'company', 'industry'];
    
    chatTypes.forEach(type => {
      const sendBtn = document.getElementById(`send-btn-${type}`);
      const input = document.getElementById(`chat-input-${type}`);
      
      if (sendBtn && input) {
        sendBtn.addEventListener('click', () => this.sendMessage(type));
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage(type);
          }
        });
      }
    });
  }

  setupAutoResize() {
    const textareas = document.querySelectorAll('.chat-input-wrapper textarea');
    textareas.forEach(textarea => {
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
      });
    });
  }

  async sendMessage(type) {
    const input = document.getElementById(`chat-input-${type}`);
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    const sendBtn = document.getElementById(`send-btn-${type}`);
    
    const message = input.value.trim();
    if (!message || this.isTyping) return;

    // ウェルカムメッセージを削除
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    // ユーザーメッセージを追加
    this.addMessage(type, message, 'user');
    if (window.sendMessage && firebaseAuth.currentUser) {
      // Firestoreに保存
      sendMessage(firebaseAuth.currentUser.uid, message);
    }
    
    // 入力欄をクリア
    input.value = '';
    input.style.height = 'auto';
    
    // 送信ボタンを無効化
    sendBtn.disabled = true;
    
    // タイピングインジケーターを表示
    this.showTypingIndicator(type);
    
    // AIレスポンスを取得
    try {
      console.log('💬 Chat System: Requesting AI response for type:', type);
      const response = await this.getAIResponse(type, message);
      this.hideTypingIndicator(type);
      this.addMessage(type, response, 'ai');
      if (window.sendMessage && firebaseAuth.currentUser) {
        sendMessage(firebaseAuth.currentUser.uid, response);
      }
      console.log('✅ Chat System: AI response received successfully');
    } catch (error) {
      console.error('❌ Chat System Error:', error);
      this.hideTypingIndicator(type);
      this.addMessage(type, 'エラーが発生しました。もう一度お試しください。', 'ai');
    }
    
    // 送信ボタンを有効化
    sendBtn.disabled = false;
    
    // チャット履歴を保存
    this.saveChatHistory();
    
    // サイドバーの履歴を更新
    this.updateSidebarHistory(type);
  }

  addMessage(type, content, sender) {
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    
    const messageGroup = document.createElement('div');
    messageGroup.className = `chat-message-group ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = sender === 'user' ? 'user-avatar' : 'ai-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `message-bubble ${sender}`;
    
    // AIの応答の場合はMarkdownをHTMLに変換
    if (sender === 'ai' && typeof marked !== 'undefined') {
        try {
          const html = marked.parse(content);
          if (typeof DOMPurify !== 'undefined') {
            messageBubble.innerHTML = DOMPurify.sanitize(html);
          } else {
            messageBubble.innerHTML = html;
          }
        } catch (error) {
          console.warn('Markdown parsing failed, using plain text:', error);
          messageBubble.textContent = content;
        }
    } else {
      messageBubble.textContent = content;
    }
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageGroup.appendChild(avatar);
    const messageContent = document.createElement('div');
    messageContent.appendChild(messageBubble);
    messageContent.appendChild(timestamp);
    messageGroup.appendChild(messageContent);
    
    messagesContainer.appendChild(messageGroup);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // チャット履歴に追加
    if (!this.currentChatId) {
      this.currentChatId = this.generateChatId();
      // 新しいチャットの場合、チャットメタデータを作成
      this.createChatSession(type);
    }
    
    const chatEntry = {
      id: this.currentChatId,
      content,
      sender,
      timestamp: new Date().toISOString(),
      type: type
    };
    
    this.chatHistory[type].push(chatEntry);
    
    // チャットセッションのタイトルを更新（最初のユーザーメッセージから）
    if (sender === 'user') {
      this.updateChatSessionTitle(type, content);
    }
  }

  showTypingIndicator(type) {
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    this.isTyping = true;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
      <div class="ai-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator(type) {
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    const typingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isTyping = false;
  }

  async getAIResponse(type, message) {
    try {
      console.log('🤖 Chat System: Checking AI service availability...');
      console.log('🔍 window.aiApiService exists:', !!window.aiApiService);
      
      // AI APIサービスを使用してレスポンスを生成
      if (window.aiApiService) {
        console.log('✅ Using AIAPIService for response');
        // 現在のチャットの履歴を取得（最新のもの）
        const currentChatHistory = this.getCurrentChatHistory(type);
        return await window.aiApiService.generateResponse(type, message, currentChatHistory);
      } else {
        console.log('❌ AIAPIService not available, using fallback');
        // フォールバック：AI APIサービスが利用できない場合
        return await this.getFallbackResponse(type, message);
      }
    } catch (error) {
      console.error('❌ AI response error:', error);
      return 'すみません、少し時間をおいてからもう一度お試しください。';
    }
  }

  getCurrentChatHistory(type) {
    // 現在のチャットIDの履歴を取得
    if (!this.currentChatId) return [];
    
    return this.chatHistory[type]
      .filter(entry => entry.id === this.currentChatId)
      .slice(-10); // 最新10件のみ
  }
  createChatSession(type) {
    const chatSession = {
      id: this.currentChatId,
      type: type,
      title: '新しいチャット',
      timestamp: new Date().toISOString(),
      messageCount: 0
    };
    
    // チャットセッションリストに追加
    if (!this.chatSessions) {
      this.chatSessions = {};
    }
    if (!this.chatSessions[type]) {
      this.chatSessions[type] = [];
    }
    
    this.chatSessions[type].unshift(chatSession); // 新しいチャットは先頭に追加
    
    // ローカルストレージに保存
    this.saveChatSessions();
    
    console.log('📝 Created new chat session:', chatSession);
  }
  updateChatSessionTitle(type, content) {
    if (!this.chatSessions || !this.chatSessions[type]) return;
    
    const session = this.chatSessions[type].find(s => s.id === this.currentChatId);
    if (session && session.title === '新しいチャット') {
      // 最初の30文字をタイトルにする
      session.title = content.length > 30 ? content.substring(0, 30) + '...' : content;
      session.timestamp = new Date().toISOString(); // タイムスタンプを更新
      
      // ローカルストレージに保存
      this.saveChatSessions();
      
      console.log('📝 Updated chat session title:', session.title);
    }
  }

  async getFallbackResponse(type, message) {
    // AI APIが使用できない場合のフォールバック応答
    const responses = {
      self: [
        'あなたの強みや価値観について詳しく教えてください。具体的なエピソードがあれば、それも含めて話していただけますか？',
        'これまでの経験で最も成長を感じた出来事は何ですか？その経験から何を学びましたか？',
        'あなたが大切にしている価値観は何ですか？それが仕事にどう活かせると思いますか？',
        '将来のキャリア目標について教えてください。どのような分野で活躍したいと考えていますか？'
      ],
      company: [
        'その企業について詳しく調べるために、まず業界や事業内容について確認しましょう。どの分野の企業ですか？',
        '企業研究では、事業内容、企業理念、成長性、職場環境などを調べることが重要です。特に知りたい点はありますか？',
        '企業の最新の業績や市場での立ち位置、競合他社との比較も大切な要素です。',
        'その企業で働く人々の声や企業文化について調べることで、自分に合う環境かどうか判断できます。'
      ],
      industry: [
        'その業界の現在のトレンドや将来性について詳しく分析してみましょう。特に注目している点はありますか？',
        '業界の主要な企業や市場規模、成長要因について調べることが重要です。',
        'その業界で求められるスキルや資格、キャリアパスについても確認しましょう。',
        '業界の課題や今後の展望についても理解を深めることで、より良い判断ができます。'
      ]
    };

    const typeResponses = responses[type] || responses.self;
    const randomResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
    
    // 応答の遅延をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return randomResponse;
  }

  generateChatId() {
    return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateChatTitle(type, content, sender) {
    if (sender === 'user') {
      // ユーザーの最初のメッセージからタイトルを生成
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    return null;
  }
  startNewChat(type) {
    console.log('🆕 Starting new chat for type:', type);
    
    this.currentChatType = type;
    
    // 新しいチャットIDを生成
    this.currentChatId = this.generateChatId();
    
    // チャットメッセージをクリア
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    messagesContainer.innerHTML = `
      <div class="welcome-message">
        <div class="ai-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <h3>${this.getWelcomeTitle(type)}</h3>
          <p>${this.getWelcomeMessage(type)}</p>
          <div class="suggested-prompts">
            ${this.getSuggestedPrompts(type)}
          </div>
        </div>
      </div>
    `;
    
    // 新しいチャットセッションを作成
    this.createChatSession(type);
    
    // サイドバーの履歴を更新
    this.updateSidebarHistory(type);
    
    console.log('✅ New chat started with ID:', this.currentChatId);
  }

  getWelcomeTitle(type) {
    const titles = {
      self: '自己分析をサポートします',
      company: '企業分析をサポートします',
      industry: '業界分析をサポートします'
    };
    return titles[type];
  }

  getWelcomeMessage(type) {
    const messages = {
      self: 'あなたの強み、価値観、キャリア目標について一緒に考えましょう。何でもお気軽にお話しください。',
      company: '気になる企業の詳細な分析や比較検討をお手伝いします。企業名や業界を教えてください。',
      industry: '各業界の動向、将来性、必要なスキルなどについて分析をお手伝いします。'
    };
    return messages[type];
  }

  getSuggestedPrompts(type) {
    const prompts = {
      self: [
        '私の強みを見つけたい',
        '価値観について考えたい',
        'キャリア目標を明確にしたい'
      ],
      company: [
        'IT業界の主要企業',
        '企業文化の調べ方',
        '企業の成長性分析'
      ],
      industry: [
        'AI・機械学習業界',
        '金融業界のトレンド',
        '成長している業界'
      ]
    };
    
    return prompts[type].map(prompt => 
      `<button class="prompt-btn" onclick="sendSuggestedPrompt('${prompt}')">${prompt}</button>`
    ).join('');
  }
  loadChatHistory() {
    const saved = localStorage.getItem('jobHuntingApp_chatHistory');
    if (saved) {
      this.chatHistory = JSON.parse(saved);
    }
  }

  saveChatHistory() {
    localStorage.setItem('jobHuntingApp_chatHistory', JSON.stringify(this.chatHistory));
  }

  loadChatSessions() {
    const saved = localStorage.getItem('jobHuntingApp_chatSessions');
    if (saved) {
      try {
        this.chatSessions = JSON.parse(saved);
        console.log('📂 Loaded chat sessions from localStorage:', this.chatSessions);
      } catch (error) {
        console.error('❌ Error loading chat sessions:', error);
        this.chatSessions = {};
      }
    } else {
      this.chatSessions = {};
    }
  }

  saveChatSessions() {
    try {
      localStorage.setItem('jobHuntingApp_chatSessions', JSON.stringify(this.chatSessions));
      console.log('💾 Saved chat sessions to localStorage');
    } catch (error) {
      console.error('❌ Error saving chat sessions:', error);
    }
  }
  updateSidebarHistory(type) {
    const todayContainer = document.getElementById(`today-chats-${type}`);
    const weekContainer = document.getElementById(`week-chats-${type}`);
    
    if (!todayContainer || !weekContainer) return;
    
    // 履歴をクリア
    todayContainer.innerHTML = '';
    weekContainer.innerHTML = '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // チャットセッションから履歴を取得
    if (this.chatSessions && this.chatSessions[type]) {
      // 日付でソート（新しい順）
      const sortedSessions = this.chatSessions[type].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      sortedSessions.forEach(session => {
        const sessionDate = new Date(session.timestamp);
        const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        if (session.id === this.currentChatId) {
          historyItem.classList.add('active');
        }
        historyItem.textContent = session.title;
        historyItem.onclick = () => this.loadChatSession(session.id, type);
        
        if (sessionDateOnly.getTime() === today.getTime()) {
          todayContainer.appendChild(historyItem);
        } else if (sessionDateOnly >= weekAgo) {
          weekContainer.appendChild(historyItem);
        }
      });
    }
    
    console.log('📋 Updated sidebar history for type:', type);
  }
  loadChatSession(chatId, type) {
    console.log('📂 Loading chat session:', chatId, type);
    
    // 現在のチャットIDを更新
    this.currentChatId = chatId;
    this.currentChatType = type;
    
    // メッセージコンテナをクリア
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    // 該当するチャット履歴を取得して表示
    const chatMessages = this.chatHistory[type].filter(entry => entry.id === chatId);
    
    if (chatMessages.length === 0) {
      // ウェルカムメッセージを表示
      messagesContainer.innerHTML = `
        <div class="welcome-message">
          <div class="ai-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="message-content">
            <h3>${this.getWelcomeTitle(type)}</h3>
            <p>${this.getWelcomeMessage(type)}</p>
            <div class="suggested-prompts">
              ${this.getSuggestedPrompts(type)}
            </div>
          </div>
        </div>
      `;
    } else {
      // メッセージを時系列順でソート
      const sortedMessages = chatMessages.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
      sortedMessages.forEach(entry => {
        this.addMessageToUI(type, entry.content, entry.sender);
      });
    }
    
    // サイドバーの履歴を更新（アクティブ状態を反映）
    this.updateSidebarHistory(type);
    
    console.log('✅ Chat session loaded successfully');
  }

  addMessageToUI(type, content, sender) {
    // UI要素の作成（addMessageと同様だが、履歴には追加しない）
    const messagesContainer = document.getElementById(`chat-messages-${type}`);
    
    const messageGroup = document.createElement('div');
    messageGroup.className = `chat-message-group ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = sender === 'user' ? 'user-avatar' : 'ai-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `message-bubble ${sender}`;
    
    // AIの応答の場合はMarkdownをHTMLに変換
      if (sender === 'ai' && typeof marked !== 'undefined') {
        try {
          const html = marked.parse(content);
          if (typeof DOMPurify !== 'undefined') {
            messageBubble.innerHTML = DOMPurify.sanitize(html);
          } else {
            messageBubble.innerHTML = html;
          }
        } catch (error) {
          console.warn('Markdown parsing failed, using plain text:', error);
          messageBubble.textContent = content;
        }
    } else {
      messageBubble.textContent = content;
    }
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = new Date().toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    messageGroup.appendChild(avatar);
    const messageContent = document.createElement('div');
    messageContent.appendChild(messageBubble);
    messageContent.appendChild(timestamp);
    messageGroup.appendChild(messageContent);
    
    messagesContainer.appendChild(messageGroup);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  createHistoryItem(chat) {
    return `
      <div class="history-item" onclick="loadChat('${chat.id}', '${this.currentChatType}')">
        <span class="history-title">${chat.title || chat.content}</span>
        <button class="delete-btn" onclick="deleteChat(event, '${chat.id}', '${this.currentChatType}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.chat-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
      
      if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.className = 'sidebar-overlay';
        newOverlay.addEventListener('click', () => this.toggleSidebar());
        document.body.appendChild(newOverlay);
      }
      
      document.querySelector('.sidebar-overlay').classList.toggle('active');
    }
  }
}

// グローバル関数
function sendSuggestedPrompt(prompt) {
  console.log('🔘 Suggested prompt clicked:', prompt);
  
  // 現在アクティブな画面を特定
  const chatScreens = ['analysis-self-screen', 'analysis-company-screen', 'analysis-industry-screen'];
  let activeScreen = null;
  let type = '';
  
  for (const screenId of chatScreens) {
    const screen = document.getElementById(screenId);
    if (screen && screen.style.display !== 'none') {
      activeScreen = screen;
      if (screenId.includes('self')) type = 'self';
      else if (screenId.includes('company')) type = 'company';
      else if (screenId.includes('industry')) type = 'industry';
      break;
    }
  }
  
  if (!activeScreen || !type) {
    console.error('❌ No active screen found');
    return;
  }
  
  console.log('📱 Active screen type:', type);
  
  const input = document.getElementById(`chat-input-${type}`);
  if (input && window.chatSystem) {
    input.value = prompt;
    input.focus();
    
    // テキストエリアのサイズを調整
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
    
    console.log('✅ Sending suggested prompt via chat system');
    window.chatSystem.sendMessage(type);
  } else {
    console.error('❌ Chat input or chatSystem not found');
  }
}

function startNewChat(type) {
  if (window.chatSystem) {
    window.chatSystem.startNewChat(type);
  }
}

function toggleSidebar() {
  if (window.chatSystem) {
    window.chatSystem.toggleSidebar();
  }
}

function loadChat(chatId, type) {
  if (window.chatSystem) {
    window.chatSystem.loadChatSession(chatId, type);
  }
}

function deleteChat(event, chatId, type) {
  event.stopPropagation();
  // チャット削除機能（今後実装）
  console.log('Deleting chat:', chatId, type);
}

// チャットシステムを初期化
let chatSystem;
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing chat system...');
  chatSystem = new ChatSystem();
  window.chatSystem = chatSystem;
  console.log('✅ Chat system initialized and attached to window');
});