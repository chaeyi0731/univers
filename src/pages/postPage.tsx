import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

interface Post {
  id: number;
  title: string;
  username: string; // 게시글 작성자 이름
  timestamp: string; // 게시글 작성 시간
}

const PostPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const userContext = useContext(UserContext); // UserContext 사용

  useEffect(() => {
    if (!userContext?.user) {
      navigate('/login');
    } else {
      fetch('/posts')
        .then((response) => response.json())
        .then((data) => setPosts(data));
    }
  }, [userContext, navigate]);

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="postwidgets">
          <h1>게시판</h1>
          {posts.map((post, index) => (
            <div key={index}>
              <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p>
                작성자: {post.username}, 작성시간: {new Date(post.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
          {userContext?.user && ( // 조건부 렌더링에서 userContext?.user 사용
            <Link to="/create-post">
              <button>게시글 작성</button>
            </Link>
          )}
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성시간</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post.id} onClick={() => handleRowClick(post.id)} style={{ cursor: 'pointer' }}>
                  <td>{index + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.username}</td>
                  <td>{new Date(post.timestamp).toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
