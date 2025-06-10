// analysis_self.js: 自己分析チャットUI仮実装

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('analysis-self-screen');
  if (!screen) return;

  const chatArea = screen.querySelector('#chat-messages-self'); // 修正
  if (!chatArea) { // chatAreaが見つからなかった場合のエラーハンドリングを追加
    console.error('Error: Chat area element not found in analysis_self-screen');
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '自己分析に関する質問や悩みを入力...';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = '送信';

  // 初回メッセージ
  chatArea.innerHTML = '<div class="chat-message system">自己分析のサポートをします。何でも入力してください。</div>';
  chatArea.appendChild(input);
  chatArea.appendChild(sendBtn);

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    // ユーザー発言を追加
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    chatArea.insertBefore(userMsg, input);
    input.value = '';
    // 仮のAI応答
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai';
      aiMsg.textContent = '（AIの応答例）あなたの強みや価値観について一緒に考えましょう。';
      chatArea.insertBefore(aiMsg, input);
    }, 600);
  });
});

