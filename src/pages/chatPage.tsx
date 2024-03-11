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
    if (user && token && !socketRef.current) {
      // 환경 변수를 사용할 때는 백틱과 ${}를 사용하여 문자열 안에 변수를 삽입합니다.
      socketRef.current = io(`${process.env.REACT_APP_API_URL}`, {
        transports: ['websocket'],
        query: { token },
      });

      socketRef.current.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      // 이전 메시지를 불러오는 함수
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

      // 소켓 연결 설정 후 메시지 불러오기
      socketRef.current.on('connect', () => {
        fetchMessages();
      });
    }

    return () => {
      // 컴포넌트가 언마운트될 때 소켓 연결을 해제합니다.
      if (socketRef.current) {
        socketRef.current.off('chat message');
        socketRef.current.disconnect(); // disconnect 메소드를 사용하여 소켓 연결 해제
        socketRef.current = null;
      }
    };
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (user && socketRef.current && message.trim() !== '') {
      const messageData = {
        username: user.name,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        user_id: user.user_id,
      };

      socketRef.current.emit('chat message', messageData);
      setMessage('');
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
