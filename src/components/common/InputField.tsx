import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange }) => {
  return (
    <div className="input-field-container">
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <input className="user-info" type={type} id={name} name={name} value={value} onChange={onChange} />
    </div>
  );
};

export default InputField;
