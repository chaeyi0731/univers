import React from 'react';
import './layout.css';
// import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footerName">
          <p>@ chaeyi project StellaTalk</p>
        </div>

        <a href="http://facebook.com" className="facebook"></a>
        <a href="http://twitter.com" className="twitter"></a>
        <a href="http://instagram.com" className="instagram"></a>
      </div>
    </footer>
  );
};

export default Footer;
