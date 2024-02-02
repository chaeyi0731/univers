import React, { useState } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 서버에 POST 요청을 보내고, 이미지는 S3에 업로드합니다.
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
