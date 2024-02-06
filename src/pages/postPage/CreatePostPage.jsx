import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // 수정됨

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleImageUpload = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image); // 'name' 속성이 'image'인 파일

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-post`, {
        method: 'POST',
        body: formData, // headers 설정 생략
      });
      const data = await response.json();
      console.log(data);
      navigate('/post'); // 함수 호출 방식으로 수정됨
    } catch (error) {
      console.error('게시글 생성 중 에러 발생:', error);
    }
  };

  return (
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
        </label>{' '}
        {/* 'name' 속성 추가됨 */}
        <button type="submit">게시글 작성</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
