import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import '../components/layout/layout.css';

const PostPage: React.FC = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
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
          {user ? (
            // 사용자가 로그인한 경우에만 게시글 목록 표시
            titles.map((title, index) => <h2 key={index}>{title}</h2>)
          ) : (
            // 사용자가 로그인하지 않은 경우 안내 메시지 표시
            <p>로그인 후에 게시글을 볼 수 있습니다.</p>
          )}
          {user && (
            // 사용자가 로그인한 경우에만 게시글 작성 버튼 표시
            <Link to="/create-post">
              <button>게시글 작성</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
