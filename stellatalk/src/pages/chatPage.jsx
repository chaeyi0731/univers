import React, { useState } from 'react';
import '../components/layout/layout.css';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    // 새 메시지를 messages 배열에 추가
    setMessages([...messages, message]);
    setMessage(''); // 입력 필드 초기화
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>StellaChat</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="메시지 입력..." value={message} onChange={handleInputChange} />
        <button onClick={handleSendClick}>전송</button>
      </div>
    </div>
  );
};

export default ChatPage;
