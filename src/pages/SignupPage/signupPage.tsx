import React, { useState } from 'react';
import axios from 'axios';
import { validateForm } from '../../utils/validation';
import InputField from '../../components/common/InputField';

const SignupPage: React.FC = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 직접 유효성 검사를 호출
    const isValid = validateForm(values);

    if (isValid) {
      try {
        // 폼 데이터가 유효한 경우, API 요청을 수행합니다.
        await axios.post(`${process.env.REACT_APP_API_URL}/signup`, values);
        alert('회원가입이 완료되었습니다.');
        // 성공적으로 회원가입 후, 다른 페이지로 리디렉션
        window.location.href = '/login';
      } catch (error) {
        // API 요청 실패 시, 오류 메시지를 표시합니다.
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } else {
      // 유효성 검사를 통과하지 못한 경우, 적절한 메시지를 표시합니다.
      alert('입력한 정보를 다시 확인해주세요.');
    }
  };

  return (
    <div className="main-content">
      <div className="signup-widgets">
        <div>
          <h1>SIGN UP</h1>
          <div className="inputForm">
            <form onSubmit={handleSubmit}>
              <InputField label="아이디" type="text" name="username" value={values.username} onChange={handleChange} />
              <InputField label="이메일" type="email" name="email" value={values.email} onChange={handleChange} />
              <InputField label="비밀번호" type="password" name="password" value={values.password} onChange={handleChange} />
              <InputField label="이름" type="text" name="name" value={values.name} onChange={handleChange} />
              <InputField label="핸드폰" type="text" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
              <InputField label="주소" type="text" name="address" value={values.address} onChange={handleChange} />
              <button type="submit">가입하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
