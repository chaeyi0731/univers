import React, { createContext, useState, ReactNode, useContext, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// User 인터페이스에서 user 필드 제거
interface User {
  user_id: number;
  username: string;
  password: string;
  phone_number: string;
  name: string;
  address: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
    }
  };

  const logout = () => {
    axios.post('http://localhost:3001/api/logout').then(() => {
      setUser(null); // 로그아웃 시 user 상태를 초기화
      navigate('/'); // 메인 페이지로 이동
    }).catch((error) => {
      console.error('로그아웃 요청 실패', error);
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 커스텀 훅을 사용하여 UserContext 내의 값에 접근
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
