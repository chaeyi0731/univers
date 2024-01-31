import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './server/router/router';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { UserProvider } from './content/UserContext';

function App() {
  return (
    <UserProvider>
      {' '}
      {/* UserProvider를 Router 바깥쪽에 추가 */}
      <Router>
        <Header />
        <AppRouter />
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
