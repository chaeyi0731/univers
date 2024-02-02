import React, { useEffect, useState, useContext } from 'react'; // useContext 훅 추가
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../content/UserContext'; // 경로 확인 필요
import '../components/layout/layout.css';

const PostPage = () => {
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate();

  // useContext를 사용하여 UserContext의 값을 가져옵니다.
  const { user } = useContext(UserContext);

  useEffect(() => {
    // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉션
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // 게시글 목록을 불러오는 API 요청
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
