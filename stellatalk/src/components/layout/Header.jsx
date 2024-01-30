import React from 'react';
import logo from '../../assets/image/stellachatlogo.png'; // 로고 이미지 경로로 변경하세요.
import './layout.css';

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="fake"></div>
        <img className="bgcimg" src={logo} alt="StellaChat Logo" />

        <div className="Info">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
