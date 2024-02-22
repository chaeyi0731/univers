import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import '../components/layout/layout.css';
import { io, Socket } from 'socket.io-client';

interface User {
  username: string;
  name: string;
  user_id: number;
}

interface Message {
  username: string;
  text: string;
  timestamp: string;
}

// 환경 변수 검사 없이 소켓 연결을 직접 초기화합니다.
const socket: Socket = io(`http://43.203.209.74:3001`, { transports: ['websocket'] });

socket.on('chat message', (msg: any) => {
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

  useEffect(() => {
    if (user) {
      socket.on('previous messages', (previousMessages) => {
        // 이전 메시지들을 상태에 설정하여 화면에 표시
        setMessages(previousMessages);
      });

      socket.on('chat message', (msg) => {
        // 새 메시지를 상태에 추가
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off('previous messages');
        socket.off('chat message');
      };
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (user) {
      // UserContext에서 로그인한 사용자 정보를 확인
      const messageData = {
        user_id: user.user_id, // 로그인한 사용자의 ID
        username: user.name, // 로그인한 사용자의 이름
        text: message, // 입력한 메시지 내용
        timestamp: new Date().toISOString(), // 메시지 보낸 시간
      };

      // 소켓을 통해 서버로 메시지 정보 전송
      socket.emit('chat message', messageData);

      // 추가적인 처리 (예: 메시지 입력 필드 초기화)
      setMessage('');
    } else {
      console.error('로그인한 사용자만 메시지를 보낼 수 있습니다.');
    }
  }; // 입력 필드 초기화

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}: </strong>
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
