import { Routes, Route } from 'react-router-dom';
import ChatPage from '../../src/pages/chatPage';
import PostPage from '../../src/pages/postPage';
import UniversePage from '../../src/pages/universePage';
import MainContent from '../../src/components/layout/MainContent';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />}></Route>
      <Route path="/chat" element={<ChatPage />}></Route>
      <Route path="/post" element={<PostPage />}></Route>
      <Route path="/universe" element={<UniversePage />}></Route>
    </Routes>
  );
};

export default Router;
