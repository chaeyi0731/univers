import React from 'react';
import AstronomyPicture from '../components/common/AstronomyPicture';

const UniversePage: React.FC = () => {
  return (
    <div className="main-content">
      <div className="widgets">
        <AstronomyPicture />
      </div>
    </div>
  );
};

export default UniversePage;
