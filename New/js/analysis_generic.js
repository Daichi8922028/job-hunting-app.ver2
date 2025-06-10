function setupAnalysisChat({screenId, chatId, placeholder, systemMessage, aiResponse}) {
  document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById(screenId);
    if (!screen) return;
    const chatArea = screen.querySelector(`#${chatId}`);
    if (!chatArea) {
      console.error(`Error: Chat area element not found in ${screenId}`);
      return;
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;

    const sendBtn = document.createElement('button');
    sendBtn.textContent = '送信';

    chatArea.innerHTML = `<div class="chat-message system">${systemMessage}</div>`;
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
        aiMsg.textContent = aiResponse;
        chatArea.insertBefore(aiMsg, input);
      }, 600);
    });
  });
}

window.setupAnalysisChat = setupAnalysisChat;
