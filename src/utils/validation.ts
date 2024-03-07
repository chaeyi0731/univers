// Validation.tsx
import React, { useEffect } from 'react';
import ValidationProps from '../components/common/interfaces/Validation/ValidationProps';

// 유효성 검사 함수를 컴포넌트와 같은 파일에 포함
const validateForm = (values: ValidationProps['values']): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\d{10,11})$/; // 10~11자리 숫자만 허용

  if (!values.username || values.username.length < 4) {
    alert('아이디는 4자 이상이어야 합니다.');
    return false;
  }
  if (!emailRegex.test(values.email)) {
    alert('유효하지 않은 이메일 형식입니다.');
    return false;
  }
  if (values.password.length < 6) {
    alert('비밀번호는 6자 이상이어야 합니다.');
    return false;
  }
  if (!phoneRegex.test(values.phoneNumber)) {
    alert('유효하지 않은 전화번호 형식입니다. 10~11자리 숫자를 입력해주세요.');
    return false;
  }

  return true; // 모든 검사를 통과했다면 true 반환
};

const Validation: React.FC<ValidationProps> = ({ values, setValidationPassed }) => {
  useEffect(() => {
    const isValid = validateForm(values);
    setValidationPassed(isValid);
  }, [values, setValidationPassed]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default Validation;
