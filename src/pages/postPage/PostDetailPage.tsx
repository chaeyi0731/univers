// PostDetailPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext';
import { Comment, PostDetail } from '../../components/common/interfaces/interfaces';
import PostDetailComponent from '../../components/common/ PostDetailComponent';
import CommentsComponent from '../../components/common/CommentsComponent';

const PostDetailPage: React.FC = () => {
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const { postId } = useParams<{ postId: string }>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    // 게시글 상세 정보를 가져옵니다.
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        const data = await response.json();
        setPostDetail(data);
      } catch (error) {
        console.error('Error fetching post detail:', error);
      }
    };

    // 해당 게시글의 댓글들을 가져옵니다.
    const fetchComments = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/comments?post_id=${postId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPostDetail();
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!userContext?.user) return;

    try {
      const response = await fetch(`h${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: userContext.user.user_id,
          content: newComment,
        }),
      });

      if (response.ok) {
        // 댓글 추가 후 댓글 목록을 새로 고칩니다.
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment(''); // 입력 필드를 비웁니다.
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting new comment:', error);
    }
  };

  return (
    <div className="main-content">
      <div className="post-widgets">
        <PostDetailComponent postDetail={postDetail} />
        <hr />
        <br />
        <CommentsComponent comments={comments} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
};

export default PostDetailPage;
