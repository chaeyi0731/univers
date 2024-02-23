import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';
import PostDetailComponent from '../../components/common/PostDetailComponent';
import CommentsComponent from '../../components/common/CommentsComponent'; // 경로 확인 필요
import usePostDetail from '../../hooks/usePostDetail';
import useCommentSubmit from '../../hooks/useCommentSubmit';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const userContext = useContext(UserContext);

  // usePostDetail 커스텀 훅으로 게시글 상세 정보와 댓글 목록을 가져옵니다.
  const { postDetail, comments, loading, error } = usePostDetail(postId);

  // useCommentSubmit 커스텀 훅으로 댓글 제출 로직을 처리합니다.
  const { newComment, setNewComment, handleCommentSubmit } = useCommentSubmit(postId, userContext?.user?.user_id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-content">
      <PostDetailComponent postDetail={postDetail} />
      <hr />
      <CommentsComponent comments={comments} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit} />
    </div>
  );
};

export default PostDetailPage;
