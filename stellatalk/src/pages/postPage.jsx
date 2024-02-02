import React, { useEffect, useState } from 'react';

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
        </div>
      </div>
    </div>
  );
};

export default PostPage;
