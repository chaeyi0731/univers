//타이틀을 작성하는 컴포넌트
import React from 'react';
import { PostTitleFieldProps } from './interfaces/interfaces';

const PostTitleField: React.FC<PostTitleFieldProps> = ({ label, value, onChange, type = 'text' }) => {
  return (
    <label className="createPostFormLabel">
      {label}:
      {type === 'text' ? <input className="createPostFormInput" type="text" value={value} onChange={onChange} /> : <textarea className="createPostFormTextarea" value={value} onChange={onChange} />}
    </label>
  );
};

export default PostTitleField;
