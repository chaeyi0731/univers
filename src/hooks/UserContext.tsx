import React, { createContext, useState, useEffect, FC } from 'react';
import axios from 'axios';
import { User, UserContextType, UserProviderProps } from '../components/common/interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

const initialUser: User | null = null;

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken();
    }
  }, []);

  const verifyToken = async (): Promise<void> => {
    try {
      const response = await axios.get<User>(`${process.env.REACT_APP_API_URL}/api/verifyToken`);
      setUser(response.data);
    } catch (error) {
      handleTokenError();
    }
  };

  const handleTokenError = (): void => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/main');
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      const { token, user: userData } = response.data;
      if (response.data.success && token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        navigate('/main');
      } else {
        alert('로그인 실패: 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
      alert('로그인 실패: 네트워크 상태를 확인하세요.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/main');
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
