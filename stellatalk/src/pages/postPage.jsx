import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../components/layout/layout.css';

const PostPage = () => {
  const [titles, setTitles] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉션
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
