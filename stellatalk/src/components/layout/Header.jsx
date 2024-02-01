// src/components/layout/Header.jsx
import './layout.css';
import React, { useContext } from 'react';
import { UserContext } from '../../content/UserContext';
import logo from '../../assets/image/stellachatlogo.png'; // 로고 이미지 경로로 변경하세요.

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const handleClick = (path) => {
    window.location.href = path;
  };
  return (
    <header>
      <div className="header">
        <div className="fake"></div>
        <img className="bgcimg" src={logo} alt="StellaChat Logo" onClick={() => handleClick('/')} />

        <div className="Info">
          {user ? (
            <>
              <span>{user.name}님 안녕하세요</span>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <button onClick={() => handleClick('/login')}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
