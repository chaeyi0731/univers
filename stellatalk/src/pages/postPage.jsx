import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PostPage = () => {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    fetch('/get')
      .then((response) => response.json())
      .then((data) => setTitles(data));
  }, []);

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="postwidgets">
          <h1>게시판</h1>
          {titles.map((title, index) => (
            <h2 key={index}>{title}</h2>
          ))}
          <Link to="/create-post">
            <button>게시글 작성</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
