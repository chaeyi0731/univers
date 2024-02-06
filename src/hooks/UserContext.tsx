import React, { createContext, useState, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  username: string;
  password: string;
  phone_number: string;
  name: string;
  address: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>; // login 함수 타입 추가
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);

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
        setUser(response.data.user); // 사용자 정보 저장
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:3001/api/logout');
      setUser(null); // 사용자 상태 초기화
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
