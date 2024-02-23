import { useState, useEffect } from 'react';

function usePostDestail(postId) {
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostAndComments() {
      try {
        setLoading(true);
        // 게시글 상세 정보 불러오기
        const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`);
        const postData = await postResponse.json();
        setPostDetail(postData);

        // 댓글 목록 불러오기
        const commentsResponse = await fetch(`${process.env.REACT_APP_API_URL}/comments?post_id=${postId}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPostAndComments();
  }, [postId]);

  return { postDetail, comments, loading };
}
