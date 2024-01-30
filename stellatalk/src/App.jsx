import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './server/router/router';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <Header />
      <AppRouter />
      <Footer />
    </Router>
  );
}

export default App;
