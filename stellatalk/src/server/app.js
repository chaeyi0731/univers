const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'stellatalk.cliyuoye061h.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'zico920914',
  database: 'stellatalk',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

app.post('/signup', async (req, res) => {
  const { username, password, name, phoneNumber, address } = req.body;

  const query = 'INSERT INTO Users (username, password, name, phone_number, address) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [username, password, name, phoneNumber, address], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error during signup');
    } else {
      res.status(201).send('User registered successfully');
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('서버 오류');
    }

    if (results.length === 0) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 데이터베이스에서 찾은 사용자
    const user = results[0];

    // 비밀번호 비교
    const isMatch = await (password, user.password);
    if (!isMatch) {
      return res.status(401).send('비밀번호가 일치하지 않습니다.');
    }
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
