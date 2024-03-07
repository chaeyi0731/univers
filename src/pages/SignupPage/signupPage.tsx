import React, { useState } from 'react';
import axios from 'axios';
import Validation from '../../utils/validation';
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

  const [validationPassed, setValidationPassed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validationPassed) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/signup`, values);
        alert('회원가입이 완료되었습니다.');
        window.location.href = '/main';
      } catch (error: any) {
        alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      }
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
              <button type="submit" disabled={!validationPassed}>
                가입하기
              </button>
            </form>
            <Validation values={values} setValidationPassed={setValidationPassed} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
