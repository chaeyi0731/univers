import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../hooks/UserContext'; // 실제 경로에 맞게 수정하세요.
import { Apod, UserContextType } from './interfaces/interfaces';

const AstronomyPicture: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [dateInput, setDateInput] = useState<string>('2023-12-25');
  const [apod, setApod] = useState<Apod | null>(null);
  const apiKey: string = 'kPaqXTtaN1YmenxQ6wEdzTovcXk8iv7fa7EMS9c8';
  // useContext에서 UserContextType을 명시적으로 사용합니다.
  const userContext = useContext<UserContextType | null>(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl: string = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateInput}`;

    axios.get(apiUrl)
      .then((response) => {
        setApod(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the APOD data: ', error);
      });
  }, [dateInput]);

  const handleClick = () => {
    // userContext가 null이 아니고, userContext 내부의 user도 null이 아닐 때만 날짜 변경을 허용합니다.
    if (!userContext || !userContext.user) {
      navigate('/login');
    }
  };

  return (
    <div>
      <p>날짜 선택</p>
      <input type="date" id="datepicker" value={dateInput} onChange={(e) => setDateInput(e.target.value)} onClick={handleClick} />
      {apod ? (
        <div>
          <h1>{apod.title || 'No Title Available'}</h1>
          <p className="universep">{apod.explanation || 'No Explanation Available'}</p>
          {apod.url ? <img className="nasaimg" src={apod.url} alt={apod.title || 'No Title'} /> : <p>No Image Available</p>}
        </div>
      ) : (
        <p>날짜를 변경해주세요 해당일에는 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default AstronomyPicture;
