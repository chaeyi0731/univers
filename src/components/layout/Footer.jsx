import React from 'react';
import './layout.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <Link to="http://facebook.com">Facebook</Link>
        <Link to="http://twitter.com">Twitter</Link>
        <Link to="http://instagram.com">Instagram</Link>
      </div>
    </footer>
  );
};

export default Footer;
