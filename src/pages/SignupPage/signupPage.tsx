import React, { useState } from 'react';
import axios from 'axios';
import { validateForm } from '../../utils/validation';
import InputField from '../../components/common/InputField';
import Postcode from './address/address';

const SignupPage: React.FC = () => {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [addressInfo, setAddressInfo] = useState({
    zipCode: '',
    roadAddress: '',
    detailAddress: '',
  });

  const handleAddressSelect = ({ zipCode, roadAddress, detailAddress }: { zipCode: string; roadAddress: string; detailAddress: string }) => {
    setAddressInfo({ zipCode, roadAddress, detailAddress });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // 제출 시에만 유효성 검사를 진행합니다.
    const isValid = validateForm(values);
  
    if (isValid) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { ...values, ...addressInfo });
        alert('회원가입이 완료되었습니다.');
        window.location.href = '/login';
      } catch (error) {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } else {
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
              <Postcode onAddressSelect={handleAddressSelect} />
              <button type="submit">가입하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
