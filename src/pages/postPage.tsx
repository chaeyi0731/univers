import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../content/UserContext';
import '../components/layout/layout.css';

const PostPage: React.FC = () => {
  const [titles, setTitles] = useState<string[]>([]); // titles의 타입을 명시
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch('/posts')
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
