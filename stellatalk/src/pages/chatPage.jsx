import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../content/UserContext';
import { useNavigate } from 'react-router-dom';
import '../components/layout/layout.css';

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
