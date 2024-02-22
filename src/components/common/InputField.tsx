import React from 'react';
import { InputFieldProps } from '../../hooks/interface';

export const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
    <label>
    {label}:
    {type === 'textarea' ? (
      <textarea value={value} onChange={onChange} />
    ) : (
      <input type={type} value={value} onChange={onChange} />
    )}
  </label>
);
