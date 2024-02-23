import { useState } from 'react';

function useCommentSubmit(postId: string, userId?: string) {
  const [newComment, setNewComment] = useState('');
  const handleCommentSubmit = async () => {
    if (!userId || !newComment.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId,
          content: newComment,
        }),
      });

      if (response.ok) {
        // 댓글 추가 후 성공 로직 처리
        setNewComment(''); // 입력 필드 초기화
      } else {
        throw new Error('Failed to post comment');
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
