import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate;

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image); // 이미지 파일 추가

    try {
      const response = await fetch('http://localhost:5001/create-post', {
        method: 'POST',
        body: formData, // multipart/form-data는 headers 설정 없이 보내야 브라우저가 자동으로 처리합니다.
      });

      const data = await response.json();
      console.log(data);
      navigate('/post');
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
          <input type="file" onChange={handleImageUpload} />
        </label>
        <button type="submit">게시글 작성</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
