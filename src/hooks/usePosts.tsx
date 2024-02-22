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
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const postsWithCorrectId = data.map((post: any) => ({
          ...post,
          post_id: Number(post.post_id),
        }));
        setPosts(postsWithCorrectId);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
        setError('Failed to load posts.');
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
