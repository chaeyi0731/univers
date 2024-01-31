const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001; // 포트 변경 가능
// const axios = require('axios');

const cors = require('cors');
app.use(cors());


//? 번역 api 문제로 인해 주석 처리
// const subscriptionKey = 'ae664ba92c324d5ba399188a33bf7bbe';
// const endpoint = 'https://api.cognitive.microsofttranslator.com';
// const location = 'stella-talk';

// app.get('/translate', async (req, res) => {
//   const { text, lang } = req.query; // 클라이언트로부터 받은 텍스트와 목표 언어

//   axios({
//     baseURL: endpoint,
//     url: '/translate',
//     method: 'post',
//     headers: {
//       'Ocp-Apim-Subscription-Key': subscriptionKey,
//       'Ocp-Apim-Subscription-Region': location,
//       'Content-Type': 'application/json',
//     },
//     params: {
//       'api-version': '3.0',
//       to: [lang],
//     },
//     data: [
//       {
//         text: text,
//       },
//     ],
//   })
//     .then((response) => {
//       res.json(response.data[0].translations[0].text);
//     })
//     .catch((error) => {
//       console.error('Error during translation:', error);
//       res.status(500).send('Translation error');
//     });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
