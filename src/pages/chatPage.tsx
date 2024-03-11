import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import '../components/layout/layout.css';
import { io, Socket } from 'socket.io-client';
import { User, Message } from '../components/common/interfaces/interfaces';

const ChatPage: React.FC = () => {
  const { user } = useContext(UserContext) as { user: User };
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (token && !socketRef.current) {
      socketRef.current = io(`${process.env.REACT_APP_API_URL}`, {
        transports: ['websocket'],
        query: { token },
      });

      socketRef.current.on('chat message', (msg: any) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // 이전 메시지를 불러오는 함수 호출
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`);
          setMessages(
            response.data.map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp).toLocaleString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Seoul',
              }),
            }))
          );
        } catch (error) {
          console.error('메시지 불러오기 실패:', error);
        }
      };
      fetchMessages();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('chat message');
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (user && socketRef.current) {
      const messageData = {
        user_id: user.user_id,
        username: user.name,
        text: message,
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit('chat message', messageData);
      setMessage('');
    } else {
      console.error('로그인한 사용자만 메시지를 보낼 수 있습니다.');
    }
  };
  return (
    <div className="main-content">
      <div className="widgets">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-bubble">
              <strong>
                {msg.username}: {msg.message}
              </strong>
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
