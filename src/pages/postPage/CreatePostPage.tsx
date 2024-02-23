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
  const userContext = useContext(UserContext); // userContext로 변경하여 전체 컨텍스트를 받아옴

  // UserContext가 null이 아닌지 확인하고 user 객체에 접근
  const user = userContext ? userContext.user : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files && setImage(e.target.files[0]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image); // 이미지가 있을 때만 추가
    }
    formData.append('user_id', user.user_id.toString()); // 사용자 ID를 문자열로 변환하여 추가

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-post`, {
        method: 'POST',
        body: formData,
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
        <PostTitleField label="제목" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextAreaField label="내용" value={content} onChange={(e) => setContent(e.target.value)} />
        <FileUploadField label="이미지 첨부" name="image" onChange={(e) => handleImageUpload(e)} />
        <button className="createPostFormButton" type="submit">
          게시글 작성
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
