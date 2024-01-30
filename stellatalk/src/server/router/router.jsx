import { Routes, Route } from 'react-router-dom';
import ChatPage from '../../pages/chatPage';
import PostPage from '../../pages/postPage';
import UniversePage from '../../pages/universePage';
import MainContent from '../../components/layout/MainContent';


const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/post" element={<PostPage />} />
      <Route path="/universe" element={<UniversePage />} />
    </Routes>
  );
};

export default Router;
