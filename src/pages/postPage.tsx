import React, { useEffect, useState, useContext } from 'react';
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
    fetch('/posts')
      .then((response) => {
        // 응답 상태 코드가 성공적인지 확인
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, []);

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
        </div>
      </div>
    </div>
  );
};

export default PostPage;
