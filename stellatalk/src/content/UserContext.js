// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data.success) {
        setUser(response.data.user); // 로그인 성공 시 사용자 정보 저장
        console.log(user);
      }
      return response;
    } catch (error) {
      console.error('로그인 요청 실패', error);
      throw error;
    }
  };
  useEffect(() => {
    console.log(user); // 상태 업데이트 확인
  }, [user]);

  console.log(user);

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null); // 사용자 상태 초기화
    } catch (error) {
      console.error('로그아웃 요청 실패', error);
    }
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
