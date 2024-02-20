import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { UserContext } from '../../hooks/UserContext';
=======
>>>>>>> d2a50fb (:hammer: Modify: 라이트세일의 버킷이용)

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
<<<<<<< HEAD
  const userContext = useContext(UserContext); // userContext로 변경하여 전체 컨텍스트를 받아옴

  // UserContext가 null이 아닌지 확인하고 user 객체에 접근
  const user = userContext ? userContext.user : null;
=======
>>>>>>> d2a50fb (:hammer: Modify: 라이트세일의 버킷이용)

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
<<<<<<< HEAD
    if (image) {
      formData.append('image', image); // 이미지가 있을 때만 추가
    }
    formData.append('user_id', user.user_id.toString()); // 사용자 ID를 문자열로 변환하여 추가
=======
    formData.append('image', image);
>>>>>>> d2a50fb (:hammer: Modify: 라이트세일의 버킷이용)

    try {
<<<<<<< HEAD
<<<<<<< HEAD
      const response = await fetch(`http://localhost:3001/create-post`, {
=======
      const response = await fetch(`http://localhost:3000/create-post`, {
>>>>>>> f209917 (:hammer: Modify: 경로 이름 변경)
=======
      const response = await fetch(`http://localhost:3001/create-post`, {
>>>>>>> cf9a8ca (:bug: Fix: 리스폰 경로 3001로 변경)
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
