import React, { createContext, useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, UserContextType, UserProviderProps } from '../components/common/interfaces/interfaces';

const initialUser: User | null = null;

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const navigate = useNavigate();

  // 애플리케이션 로딩 시 localStorage에서 JWT를 검사하여 사용자 인증 상태를 설정
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // 여기서 추가적으로 사용자 상태를 서버로부터 확인할 수 있는 API를 호출할 수 있습니다.
    }
  }, []);

  // 애플리케이션 로딩 시 사용자 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // 서버에 사용자 인증 상태 확인 요청
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/verifyToken`)
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user); // 사용자 정보로 상태 업데이트
          } else {
            // 토큰이 유효하지 않은 경우
            localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
            setUser(null); // 사용자 상태 초기화
          }
        })
        .catch((error) => {
          console.error('사용자 인증 상태 확인 실패', error);
          localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
          setUser(null); // 사용자 상태 초기화
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // JWT 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setUser(response.data.user); // 여기서 사용자 정보 상태 업데이트
        navigate('/'); // 리다이렉트
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
      localStorage.removeItem('token'); // JWT를 localStorage에서 제거
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/'); // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
