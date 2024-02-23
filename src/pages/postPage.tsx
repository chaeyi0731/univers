import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import usePosts from '../hooks/usePosts';
import PostTable from '../components/common/PostTable';

const PostPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const { posts, error, isLoading } = usePosts(userContext!, navigate);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-content">
      <div className="widgets">
        <div className="postwidgets">
          <h1>게시판</h1>
          <Link to="/create-post">
            <button>게시글 작성</button>
          </Link>
          <PostTable posts={posts} onRowClick={(postId) => navigate(`/post/${postId}`)} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
