// analysis_industry.js: 業界分析チャットUI仮実装

document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('analysis-industry-screen');
  if (!screen) return;

  const chatArea = screen.querySelector('#chat-messages-industry'); // 修正
  if (!chatArea) { // chatAreaが見つからなかった場合のエラーハンドリングを追加
    console.error('Error: Chat area element not found in analysis_industry-screen');
    return;
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '知りたい業界や分野を入力...';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = '送信';

  chatArea.innerHTML = `<div class="chat-message system">業界分析に関する質問や関心のある分野を入力してください。</div>`;
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
      aiMsg.textContent = '（AIの応答例）入力いただいた業界の最新情報や動向についてご案内します。';
      chatArea.insertBefore(aiMsg, input);
    }, 600);
  });
});
