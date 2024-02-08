import React, { useState } from 'react';
import axios from 'axios';

interface UserInfo {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
}

const SignupPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo.username || !userInfo.password || !userInfo.name || !userInfo.phoneNumber || !userInfo.address) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      await axios.post('http://13.125.146.112:3001/signup', userInfo);
      alert('회원가입이 완료되었습니다.');
      window.location.href = '/';
    } catch (error: any) {
      alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="main-content">
      <div className="signup-widgets">
        <h1>SIGN UP</h1>
        <form onSubmit={handleSubmit}>
          <p>아이디</p>
          <input className="user-info" type="text" name="username" value={userInfo.username} onChange={handleInputChange} />
          <p>비밀번호</p>
          <input className="user-info" type="password" name="password" value={userInfo.password} onChange={handleInputChange} />
          <p>이름</p>
          <input className="user-info" type="text" name="name" value={userInfo.name} onChange={handleInputChange} />
          <p>핸드폰</p>
          <input className="user-info" type="text" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleInputChange} />
          <p>주소</p>
          <input className="user-info" type="text" name="address" value={userInfo.address} onChange={handleInputChange} />
          <button type="submit" className="signup-button">
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
