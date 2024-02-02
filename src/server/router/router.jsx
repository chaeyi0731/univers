import { Routes, Route } from 'react-router-dom';
import ChatPage from '../../pages/chatPage';
import PostPage from '../../pages/postPage';
import UniversePage from '../../pages/universePage';
import MainContent from '../../components/layout/MainContent';
import LoginPage from '../../pages/LoginPage/loginPage';
import SignupPage from '../../pages/SignupPage/signupPage';
import CreatePostPage from '../../pages/postPage/CreatePostPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      {/* 헤더 로그인/회원가입 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      {/* 컨텐츠 영역 */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/post" element={<PostPage />} />
      <Route path="/universe" element={<UniversePage />} />
      {/* 게시글 작성 라우트 */}
      <Route path="/create-post" element={<CreatePostPage />} />
    </Routes>
  );
};

export default Router;
