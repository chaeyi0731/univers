import React from 'react';
import './layout.css';

function MainContent() {
  return (
    <main className="main-content">
      <div className="content">
        <div className="chat" ></div>
        <div className="post"></div>
        <div className="universe"></div>
      </div>
    </main>
  );
}

export default MainContent;
