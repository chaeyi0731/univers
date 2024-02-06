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
      // fetch 함수 호출 시 await 사용
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-post`, {
        method: 'POST',
        body: formData,
        // 추가할 수 있는 headers 설정
        headers: {
          Accept: 'application/json',
          // 'Content-Type': 'multipart/form-data'는 multipart/form-data의 경우 자동으로 설정됩니다.
          // 따라서 이 header는 명시적으로 설정하지 않아도 됩니다.
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // 서버 응답이 OK가 아닌 경우 에러 처리
      }
      const data = await response.json();
      console.log(data);
      navigate('/post'); // 함수 호출 방식으로 수정됨
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
          </label>{' '}
          {/* 'name' 속성 추가됨 */}
          <button type="submit">게시글 작성</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
