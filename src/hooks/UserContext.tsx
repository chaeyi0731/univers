// UserContext.tsx
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
      axios
        .get<User>(`${process.env.REACT_APP_API_URL}/api/verifyToken`)
        .then((response) => {
          setUser(response.data); // 직접 User 타입으로 상태 업데이트
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      const { token } = response.data;
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(response.data.user);
        navigate('/main');
      } else {
        // 서버로부터 응답은 받았지만, 로그인에 실패했을 경우
        alert('로그인 실패: 아이디와 비밀번호를 체크하세요.');
        navigate('/login');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
      // 네트워크 에러나 서버 에러 등으로 인한 로그인 실패
      alert('로그인 실패: 아이디와 비밀번호를 체크하세요.');
      navigate('/login');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
