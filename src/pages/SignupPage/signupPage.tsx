import React from 'react';
import axios from 'axios';
import { useForm } from '../../hooks/useForm'; // useForm 훅 import 경로 확인
import InputField from '../../components/common/InputField';
import SubmitButton from '../../components/common/SubmitButtonProps';

const SignupPage: React.FC = () => {
  // useForm 훅을 사용하여 폼 상태 관리
  const { values, handleChange } = useForm({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // values를 사용하여 폼 제출 로직 구현
    if (!values.username || !values.password || !values.name || !values.phoneNumber || !values.address) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, values);
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
          <InputField label="아이디" type="text" name="username" value={values.username} onChange={handleChange} />
          <InputField label="비밀번호" type="password" name="password" value={values.password} onChange={handleChange} />
          <InputField label="이름" type="text" name="name" value={values.name} onChange={handleChange} />
          <InputField label="핸드폰" type="text" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
          <InputField label="주소" type="text" name="address" value={values.address} onChange={handleChange} />
          <SubmitButton label="가입하기" />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
