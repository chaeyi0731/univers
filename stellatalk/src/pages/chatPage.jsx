import React, { useState, useContext } from 'react';
import { UserContext } from '../content/UserContext';
import '../components/layout/layout.css';

const ChatPage = () => {
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    // 새 메시지 객체를 messages 배열에 추가
    const newMessage = {
      text: message,
      userName: user ? user.name : '익명',
    };
    setMessages([...messages, newMessage]);
    setMessage(''); // 입력 필드 초기화
  };

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.userName}: </strong>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input type="text" placeholder="메시지 입력..." value={message} onChange={handleInputChange} />
          <button onClick={handleSendClick}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
