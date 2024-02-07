import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import '../components/layout/layout.css';

const PostPage: React.FC = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const navigate = useNavigate();
  const userContext = useContext(UserContext); // UserContext 전체를 가져옴

  // UserContext가 null이거나 user 프로퍼티가 없는 경우에 대한 예외 처리 추가
  const user = userContext?.user;

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
          {user ? titles.map((title, index) => <h2 key={index}>{title}</h2>) : <p>로그인 후에 게시글을 볼 수 있습니다.</p>}
          {user && (
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
