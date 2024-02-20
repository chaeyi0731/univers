import React, { useEffect, useState, useContext, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const handleRowClick = useCallback(
    (postId: number) => {
      navigate(`/post/${postId}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (!userContext?.user) {
      navigate('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // 각 post의 id를 숫자로 변환
        const postsWithCorrectId = data.map((post: any) => ({
          ...post,
          post_id: Number(post.post_id),
        }));
        setPosts(postsWithCorrectId);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        setError('Failed to load posts.');
      }
    };

    fetchPosts();
  }, [userContext, navigate]);

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="postwidgets">
          <h1>게시판</h1>
          {error && <p className="error">{error}</p>}
          {userContext?.user && (
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
