// src/components/ChatBox.jsx
import React from "react";

const ChatBox = ({ chatMessages, chatInput, setChatInput, sendChatMessage }) => {
  return (
    <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
      <div style={{
        maxHeight: '200px',
        overflowY: 'scroll',
        background: 'rgba(0,0,0,0.6)',
        padding: '10px',
        color: 'white'
      }}>
        {chatMessages.map((msg, idx) => (
          <div key={idx}><strong>{msg.senderId}</strong>: {msg.content}</div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (chatInput.trim()) {
            sendChatMessage(chatInput);
            setChatInput('');
          }
        }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button type="submit">전송</button>
      </form>
    </div>
  );
};

export default ChatBox;
