import React from 'react';
import './layout.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footerName">
          <p>@ chaeyi project StellaTalk</p>
        </div>
        <Link to="http://facebook.com" className="facebook"></Link>
        <Link to="http://twitter.com" className="twitter"></Link>
        <Link to="http://instagram.com" className="instagram"></Link>
      </div>
    </footer>
  );
};

export default Footer;
