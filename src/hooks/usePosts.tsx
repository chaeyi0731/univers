import { useState, useEffect } from 'react';
import { Post } from '../components/common/interfaces/interfaces';
import { UserContextType } from '../components/common/interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

const usePosts = (userContext: UserContextType, navigate: ReturnType<typeof useNavigate>) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        const data = await response.json();
        const postsWithCorrectId = data.map((post: any) => ({
          ...post,
          post_id: Number(post.post_id),
        }));
        setPosts(postsWithCorrectId);
      } catch (error) {
        console.error('게시물을 불러오는 중 문제가 발생했습니다:', error);
        setError('게시물을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userContext?.user) {
      fetchPosts();
    } else {
      navigate('/login');
    }
  }, [userContext, navigate]);

  return { posts, error, isLoading };
};

export default usePosts;
