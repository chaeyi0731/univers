// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './content/UserContext';
import AppRouter from './server/router/router';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <AppRouter />
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
