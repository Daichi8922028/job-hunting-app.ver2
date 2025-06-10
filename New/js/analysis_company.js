// analysis_company.js: 企業分析チャットUI仮実装

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('analysis-company-screen');
  if (!screen) return;

  const chatArea = screen.querySelector('#chat-messages-company'); // 修正
  if (!chatArea) { // chatAreaが見つからなかった場合のエラーハンドリングを追加
    console.error('Error: Chat area element not found in analysis_company-screen');
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '企業名や気になる業界の特徴を入力...';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = '送信';

  chatArea.innerHTML = '<div class="chat-message system">企業分析のお手伝いをします。質問や知りたい企業名を入力してください。</div>';
  chatArea.appendChild(input);
  chatArea.appendChild(sendBtn);

  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = text;
    chatArea.insertBefore(userMsg, input);
    input.value = '';
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai';
      aiMsg.textContent = '（AIの応答例）入力いただいた企業情報や特徴について解説します。';
      chatArea.insertBefore(aiMsg, input);
    }, 600);
  });
});
