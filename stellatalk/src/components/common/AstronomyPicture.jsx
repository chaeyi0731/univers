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
      const translateApiUrl = `http://localhost:5000/universe`; // 서버의 번역 API 엔드포인트
      axios
        .get(`${translateApiUrl}?text=${encodeURIComponent(apod.explanation)}&lang=ko`)
        .then((response) => {
          setTranslatedExplanation(response.data.translatedText);
        })
        .catch((error) => {
          console.error('Error fetching the translation: ', error);
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
        <p>Loading APOD data or No Data Available for this Date</p>
      )}
    </div>
  );
};

export default AstronomyPicture;
