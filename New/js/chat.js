// chat.js: basic Firestore chat utilities
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export async function sendMessage(uid, message) {
  await addDoc(collection(firebaseDb, 'chats'), {
    uid,
    message,
    timestamp: serverTimestamp()
  });
}

export function subscribeToChat(callback) {
  const q = query(collection(firebaseDb, 'chats'), orderBy('timestamp'));
  onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach(doc => messages.push(doc.data()));
    callback(messages);
  });
}

// expose globally
window.sendMessage = sendMessage;
window.subscribeToChat = subscribeToChat;
