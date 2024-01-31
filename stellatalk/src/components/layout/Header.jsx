import React from 'react';
import logo from '../../assets/image/stellachatlogo.png'; // 로고 이미지 경로로 변경하세요.
import './layout.css';

const Header = () => {
  const handleClick = (path) => {
    window.location.href = path;
  };
  return (
    <header>
      <div className="header">
        <div className="fake"></div>
        <img className="bgcimg" src={logo} alt="StellaChat Logo" onClick={() => handleClick('/')} />

        <div className="Info">
          <button onClick={() => handleClick('/login')}>Login</button>
          <button onClick={() => handleClick('/signup')}>Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
