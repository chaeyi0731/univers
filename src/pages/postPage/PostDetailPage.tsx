import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';
import PostDetailComponent from '../../components/common/PostDetailComponent';
import CommentsComponent from '../../components/common/CommentsComponent'; // 경로 확인 필요
import usePostDetail from '../../hooks/usePostDetail';
import useCommentSubmit from '../../hooks/useCommentSubmit';

const PostDetailPage: React.FC = () => {
  // usePostDetail 커스텀 훅으로 게시글 상세 정보와 댓글 목록을 가져옵니다.
  const { postId } = useParams<{ postId?: string }>(); // postId가 undefined일 수 있음을 명시
  const { postDetail, comments, loading } = usePostDetail(postId ?? ''); // postId가 undefined일 경우, 기본값으로 "" 사용

  //? userId 매개변수를 useCommentSubmit 훅에 전달하기 전에 문자열로 변환 undefined 일시에 빈 문자열로 반환

  const { newComment, setNewComment, handleCommentSubmit } = useCommentSubmit(postId || '');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <div>
        <PostDetailComponent postDetail={postDetail} />
        <hr />
        <CommentsComponent comments={comments} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
};

export default PostDetailPage;
