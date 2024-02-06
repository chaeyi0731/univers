import React, { useState, useEffect } from 'react';
import axios from 'axios';

// NASA의 APOD API로부터 받아올 데이터의 타입을 정의합니다.
interface Apod {
  title: string;
  explanation: string;
  url: string;
}

const AstronomyPicture: React.FC = () => {
  const [apod, setApod] = useState<Apod | null>(null);
  const [dateInput, setDateInput] = useState<string>(() => {
    // 현재 날짜를 YYYY-MM-DD 형식으로 가져옵니다.
    const today = new Date();
    const date: string = today.toISOString().split('T')[0];
    return date;
  });
  const apiKey: string = 'kPaqXTtaN1YmenxQ6wEdzTovcXk8iv7fa7EMS9c8';

  useEffect(() => {
    const apiUrl: string = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateInput}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setApod(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the APOD data: ', error);
      });
  }, [dateInput]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(event.target.value);
  };

  return (
    <div>
      <p>날짜 선택</p>
      <input type="date" id="datepicker" value={dateInput} onChange={handleDateChange} />
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
