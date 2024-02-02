import './layout.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../content/UserContext';

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <header>
      <div className="header">
        <div className="fake"></div>
        <Link to="/">
          <img className="bgcimg" src={'https://stellatalk.s3.ap-northeast-2.amazonaws.com/image/stellachatlogo.png'} alt="StellaChat Logo" />
        </Link>

        <div className="Info">
          {user ? (
            <>
              <span>{user.name}님 안녕하세요</span>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <Link to="/login" className="header-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
