const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001; // 포트 변경 가능
// const axios = require('axios');

//! db 설정
const mysql = require('mysql');
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

const cors = require('cors');
app.use(cors());

const bcrypt = require('bcryptjs');
app.use(express.json()); // JSON 본문 파싱을 위한 미들웨어

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM User WHERE username = ?';

  db.query(query, [username], async (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({ success: true, user: { name: user.name, username: user.username } });
    } else {
      res.status(401).send('Incorrect password');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
