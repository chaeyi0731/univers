import './layout.css';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';

const Header = () => {
  const { user, logout } = useContext(UserContext)!;
  const userContext = useContext(UserContext);
  if (!userContext) return null; // UserContext가 제공되지 않은 경우를 처리

  return (
    <header>
      <div className="header">
        <div className="fake"></div>
        <Link to="/main">
          <img className="bgcimg" src={'https://stellatalk.s3.ap-northeast-2.amazonaws.com/image/univers.png'} alt="Universe Logo" />
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
