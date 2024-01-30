import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundImage: `url('path-to-your-background-image')` }}>
      {' '}
      {/* 배경 이미지 경로로 변경하세요. */}
      {/* 소셜 미디어 아이콘들 - 필요에 따라 수정하세요. */}
      <a href="http://facebook.com">Facebook</a>
      <a href="http://twitter.com">Twitter</a>
      <a href="http://instagram.com">Instagram</a>
      {/* 저작권 정보 - 필요에 따라 수정하세요. */}
      <p>&copy; {new Date().getFullYear()} StellaChat</p>
    </footer>
  );
};

export default Footer;
