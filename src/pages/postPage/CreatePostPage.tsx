import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';

interface PostFormData {
  title: string;
  content: string;
  image?: File; // 이미지는 선택적으로 포함될 수 있습니다.
}

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext?.user; // userContext에서 로그인한 사용자 정보 가져오기

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image); // 이미지가 있는 경우에만 추가
    formData.append('userId', user.user_id.toString()); // 로그인한 사용자의 ID를 문자열로 변환하여 추가

    try {
      const response = await fetch('http://localhost:3001/create-post', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 쿠키를 포함시키는 경우
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      navigate('/posts'); // 게시글 목록 페이지로 이동
    } catch (error) {
      console.error('게시글 생성 중 에러 발생:', error);
    }
  };

  return (
    <div className="main-content">
      <div className="widgets">
        <form onSubmit={handleSubmit}>
          <label>
            제목:
            <input type="text" value={title} onChange={handleTitleChange} />
          </label>
          <label>
            내용:
            <textarea value={content} onChange={handleContentChange} />
          </label>
          <label>
            이미지 첨부:
            <input type="file" name="image" onChange={handleImageUpload} />
          </label>
          <button type="submit">게시글 작성</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
