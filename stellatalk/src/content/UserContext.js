// src/context/UserContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.data.success) {
        // 로그인 성공
        setUser(response.data.user); // 사용자 정보를 상태에 저장
      } else {
        // 로그인 실패 처리
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패', error);
    }
  };
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