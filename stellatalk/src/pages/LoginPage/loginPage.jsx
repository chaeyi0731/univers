import React, { useContext } from 'react';
import { UserContext } from '..//../content/UserContext';

const LoginPage = () => {
  const { login } = useContext(UserContext);
  return (
    <div className="main-content">
      <div className="login-widgets">
        <div className="login-top">
          <h1>LOG IN</h1>
          <input className="login-input" type="text"></input>
          <input className="login-input" type="password"></input>
        </div>
        <div className="login-bottom">
          <div className="fined">
            <div>아이디찾기/</div>
            <div>비밀번호찾기</div>
          </div>
          <div className="login-btn">
            <button className="login-button"> 로그인하기 </button>
            <button className="signup-button"> 회원가입하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
