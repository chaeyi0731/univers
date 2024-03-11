import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface TokenType {
  user_id: string;
  username: string;
}

function useCommentSubmit(postId: string) {
  const [newComment, setNewComment] = useState('');

  // JWT 토큰에서 user_id를 추출하는 함수
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenType>(token);
        return decoded.user_id; // 디코딩된 페이로드에서 user_id를 반환합니다.
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const handleCommentSubmit = async () => {
    const userId = getUserIdFromToken(); // user_id를 토큰에서 추출
    if (!userId || !newComment.trim()) {
      console.log('UserId is undefined or comment is empty');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId, // 추출한 user_id를 사용
          content: newComment,
        }),
      });

      if (response.ok) {
        // 요청이 성공적이라면, 상태를 업데이트합니다.
        setNewComment(''); // 입력 필드 초기화
      } else {
        // 서버 응답이 성공적이지 않은 경우 오류 처리
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
