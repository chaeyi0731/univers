import React, { createContext, useState, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 사용자 인터페이스
interface User {
  user_id: number;
  username: string;
  password: string;
  phone_number: string;
  name: string;
  address: string;
}

// UserContext 타입
interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// UserContext의 기본값 설정
const defaultUserContext: UserContextType = {
  user: null,
  login: async () => {},
  logout: async () => {},
};

// UserContext 생성
export const UserContext = createContext<UserContextType>(defaultUserContext);

// UserProvider 컴포넌트
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/login`, { username, password });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`http://localhost:3001/api/logout`);
      setUser(null); // 로그아웃 시 user 상태를 초기화
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  // UserContext.Provider에 현재 상태와 함수들을 전달
  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
