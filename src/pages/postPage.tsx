import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

interface Post {
  id: number;
  title: string;
  username: string;
  timestamp: string;
}

const PostPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    // userContext가 유효한지 확인
    if (!userContext || !userContext.user) {
      navigate('/login');
      return;
    }

    // 포스트 데이터 가져오기
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      }
    };

    fetchPosts();
  }, [navigate, userContext]);

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="postwidgets">
          <h1>게시판</h1>
          {userContext?.user && (
            <Link to="/create-post">
              <button>게시글 작성</button>
            </Link>
          )}
          {posts.map((post, index) => (
            <div key={index} className="post-list">
              <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p>
                작성자: {post.username}, 작성시간: {new Date(post.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
