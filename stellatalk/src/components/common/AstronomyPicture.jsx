import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AstronomyPicture = () => {
  const [apod, setApod] = useState(null);
  const [translatedExplanation, setTranslatedExplanation] = useState('');
  const [dateInput, setDateInput] = useState(() => {
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    return date;
  });
  const apiKey = 'kPaqXTtaN1YmenxQ6wEdzTovcXk8iv7fa7EMS9c8';

  useEffect(() => {
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateInput}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setApod(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the APOD data: ', error);
      });
  }, [dateInput]);

  useEffect(() => {
    if (apod && apod.explanation) {
      // 서버의 번역 엔드포인트 호출
      const translateApiUrl = `http://localhost:5001/translate`;
      const params = new URLSearchParams({
        text: apod.explanation,
        lang: 'ko',
      });

      axios
        .get(`${translateApiUrl}?${params.toString()}`)
        .then((response) => {
          setTranslatedExplanation(response.data); // 수정된 부분: 서버 응답 구조에 맞게 접근
        })
        .catch((error) => {
          console.error('Error fetching the translation:', error);
        });
    }
  }, [apod]);
  const handleDateChange = (event) => {
    setDateInput(event.target.value);
  };

  return (
    <div>
      <input type="date" id="datepicker" value={dateInput} onChange={handleDateChange} />
      {apod ? (
        <div>
          <h1>{apod.title || 'No Title Available'}</h1>
          <p>{apod.explanation || 'No Explanation Available'}</p>
          <p>Translated Explanation: {translatedExplanation || 'No Translation Available'}</p>
          {apod.url ? <img className="nasaimg" src={apod.url} alt={apod.title || 'No Title'} /> : <p>No Image Available</p>}
        </div>
      ) : (
        <p>날짜를 변경해주세요 해당일에는 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default AstronomyPicture;
