import React from 'react';
import './layout.css';

function MainContent() {
  const handleClick = (path) => {
    window.location.href = path;
  };

  return (
    <main className="main-content">
      <div className="content">
        <div className="chat" onClick={() => handleClick('/chat')}>
          <div></div>
          <p className="mainp">CHAT</p>
        </div>
        <div className="post" onClick={() => handleClick('/post')}>
          <div></div>
          <p className="mainp">POST</p>
        </div>
        <div className="universe" onClick={() => handleClick('/universe')}>
          <div></div>
          <p className="mainnp">UNIVERSE</p>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
