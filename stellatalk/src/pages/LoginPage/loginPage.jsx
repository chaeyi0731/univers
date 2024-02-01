import React, { useContext, useState } from 'react';
import { UserContext } from '../../content/UserContext'; // 경로 수정
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = async () => {
    try {
      await login(username, password);
      navigate('/'); // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
      console.error('로그인 요청 실패', error);
      alert('로그인 요청 실패');
    }
  };

  return (
    <div className="main-content">
      <div className="login-widgets">
        <div className="login-top">
          <h1>LOG IN</h1>
          <input className="login-input" type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="login-bottom">
          <div className="login-btn">
            <button className="login-button" onClick={handleLoginClick}>
              로그인하기
            </button>
            <button className="signup-button" onClick={() => navigate('/signup')}>
              회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
