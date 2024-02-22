import React from 'react';
import { useCreatePostForm } from './UseCreatPostForm';
import { InputField } from './InputField';
import SubmitButton from './SubmitButton';

export const CreatePage: React.FC = () => {
  const { title, content, handleTitleChange, handleContentChange, handleImageUpload, handleSubmit } = useCreatePostForm();

  return (
    <div className="main-content">
      <div className="widgets">
        <form className="createPostFormContainer" onSubmit={handleSubmit}>
          <InputField label="제목" type="text" value={title} onChange={handleTitleChange} />
          <InputField label="내용" type="textarea" value={content} onChange={handleContentChange} />
          <label className="createPostFormLabel">
            이미지 첨부:
            <input className="createPostFormInput" type="file" name="image" onChange={handleImageUpload} />
          </label>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
};
