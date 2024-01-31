const SignupPage = () => {
  return (
    <div className="main-content">
      <div className="signup-widgets">
        <h1>SING UP</h1>
        <div className="text-left">
          <p>아이디</p>
          <input className="user-info" type="text"></input>
          <p>비밀번호</p>
          <input className="user-info" type="password"></input>
          <p>이름 </p>
          <input className="user-info" type="text"></input>
          <p>핸드폰 </p>
          <input className="user-info" type="text"></input>
          <p>우편번호</p>
          <input className="user-info" type="text"></input>
          <p>주소</p>
          <div className="user-info" type="text"></div>

          <button className="signup-button"> 가입하기 </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
