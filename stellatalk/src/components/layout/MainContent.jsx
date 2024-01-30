import React from 'react';

import './layout.css';

function MainContent() {
  return (
    <main className="main-content">
      <div className="content">
        <div className="chat">
          <div></div>
          <p className="mainp">CHAT</p>
        </div>
        <div className="post">
          <div></div>
          <p className="mainp">POST</p>
        </div>
        <div className="universe">
          <div></div>
          <p className="mainnp">UNIVERSE</p>
        </div>
      </div>
    </main>
  );
}

export default MainContent;
