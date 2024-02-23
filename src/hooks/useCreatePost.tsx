import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';

const useCreatePost = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const createPost = async (title: string, content: string, image: File | null) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    formData.append('user_id', user.user_id.toString());

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-post`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 성공적으로 게시글이 생성되면, 예를 들어 게시글 목록 페이지로 리다이렉트
      navigate('/post');
    } catch (error) {
      console.error('게시글 생성 중 에러 발생:', error);
    }
  };

  return createPost;
};

export default useCreatePost;
