import React, { createContext, useState, ReactNode, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, UserContextType } from '../components/common/interfaces/interfaces';



const initialUser: User | null = null; // 초기 user 상태를 null로 설정

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`);
      setUser(null); // 로그아웃 시 user 상태를 초기화
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
