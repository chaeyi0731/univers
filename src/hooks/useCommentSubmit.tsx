import { useState, useContext } from 'react';
import { UserContext } from '../hooks/UserContext';

function useCommentSubmit(postId: string) {
  const [newComment, setNewComment] = useState('');
  const userContext = useContext(UserContext);

  const handleCommentSubmit = async () => {
    if (!userContext?.user || !newComment.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
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
        // 성공적으로 댓글이 추가되었다면, 필요한 상태 업데이트 또는 후속 조치를 여기에 구현
        setNewComment(''); // 댓글 입력 필드 초기화
      } else {
        // 에러 처리
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting new comment:', error);
    }
  };

  return {
    newComment,
    setNewComment,
    handleCommentSubmit,
  };
}

export default useCommentSubmit;
