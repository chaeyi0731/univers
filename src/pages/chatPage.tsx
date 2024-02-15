// ChatPage.tsx
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import '../components/layout/layout.css';
import io from 'socket.io-client';

interface User {
  username: string;
  name: string;
}

interface Message {
  userName: string;
  text: string;
  timestamp: string;
}

const socket = io('http://13.125.146.112:3001/chatting');

socket.on('chat message', (msg) => {
  console.log(msg);
});

const ChatPage: React.FC = () => {
  const { user } = useContext(UserContext) as { user: User };
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (!user || !user.username) {
      console.error('로그인한 사용자만 메시지를 보낼 수 있습니다.');
      return;
    }

    const newMessage: Message = {
      userName: user.name,
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.emit('chat message', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
