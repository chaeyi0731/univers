import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../content/UserContext';
import { useNavigate } from 'react-router-dom';
import '../components/layout/layout.css';
import io from 'socket.io-client';
const socket = io('http://localhost:5001');

const ChatPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (!user || !user.username) {
      console.error('로그인한 사용자만 메시지를 보낼 수 있습니다.');
      return;
    }

    const newMessage = {
      userName: user.name, // 사용자의 이름
      text: message,
      timestamp: new Date().toISOString(),
    };
  
    socket.emit('chat message', newMessage);
    setMessages([...messages, newMessage]);
    setMessage('');
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
