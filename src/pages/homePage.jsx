import React from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

function MainContent() {
  return (
    <main className="main-content">
      <div className="content">
        <Link to="/chat" className="chat">
          <div></div>
          <p className="mainp">CHAT</p>
        </Link>
        <Link to="/post" className="post">
          <div></div>
          <p className="mainp">POST</p>
        </Link>
        <Link to="/universe" className="universe">
          <div></div>
          <p className="mainnp">UNIVERSE</p>
        </Link>
      </div>
    </main>
  );
}

export default MainContent;
