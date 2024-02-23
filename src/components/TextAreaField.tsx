import React from 'react';
import { TextAreaFieldProps } from './common/interfaces/interfaces';

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="createPostFormLabel">
        {label}:
        <textarea className="createPostFormTextarea" value={value} onChange={onChange} />
      </label>
    </div>
  );
};

export default TextAreaField;
