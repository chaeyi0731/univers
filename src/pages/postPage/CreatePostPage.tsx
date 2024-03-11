import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';
import PostTitleField from '../../components/common/PostTitleField';
import TextAreaField from '../../components/common/TextAreaField';
import FileUploadField from '../../components/common/FileUploadFieldProps';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const user = userContext ? userContext.user : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setImage(e.target.files[0]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      // 토큰이 없을 경우에 대한 처리
      console.error('토큰이 없습니다.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-post`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      navigate('/post');
    } catch (error) {
      console.error('게시글 생성 중 에러 발생:', error);
    }
  };

  return (
    <div className="main-content">
      <form className="createPostFormContainer" onSubmit={handleSubmit}>
        <PostTitleField label="제목" type="text" name="title" value={title} onChange={handleTitleChange} />
        <TextAreaField label="내용" value={content} onChange={handleContentChange} />
        <FileUploadField label="이미지 첨부" name="image" onChange={handleImageUpload} />
        <button className="createPostFormButton" type="submit">
          게시글 작성
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
