// src/context/UserContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/login', { username, password });
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
    await axios.post('http://localhost:5001/api/logout');
    setUser(null); // 사용자 상태 초기화
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};
