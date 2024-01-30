import { Routes, Route } from 'react-router-dom';
import ChatPage from '../../src/pages/chatPage';

const Router = () => {
  return (
    <Routes>
      <Route path="/chat" element={<ChatPage />}></Route>
    </Routes>
  );
};

export default Router;
