// src/context/UserContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      return response; // 수정: 서버 응답을 반환
    } catch (error) {
      console.error('로그인 요청 실패', error);
      throw error; // 수정: 에러를 다시 throw하여 호출 측에서 처리할 수 있도록 함
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
