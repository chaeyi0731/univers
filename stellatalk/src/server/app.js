// sever/app,js
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

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

    // 로그인 성공 시 사용자 정보 반환
    res.send({ success: true, user });
  });
});

app.post('/api/logout', (req, res) => {
  // 세션 또는 토큰 기반 인증을 사용하는 경우 여기에서 처리

  // 로그아웃 성공 응답 보내기
  res.send({ success: true, message: 'Successfully logged out' });
});
//? 채팅 관련 API

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 끊었습니다:', socket.id);
  });
});
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    // 모든 클라이언트에 메시지 전송
    io.emit('chat message', msg);

    // 데이터베이스에 메시지 저장
    const query = 'INSERT INTO chatMessage (user_id, message) VALUES (?, ?)';
    db.query(query, [msg.userId, msg.message, msg.timestamp], (err, result) => {
      if (err) {
        console.error('메시지 저장 중 오류 발생:', err);
        return;
      }
      console.log('메시지가 데이터베이스에 저장되었습니다:', result.insertId);
    });
  });
});

app.get('/api/chat', (req, res) => {
  const query = 'SELECT * FROM chatMessage ORDER BY timestamp DESC LIMIT 50';
  db.query(query, (err, results) => {
    if (err) {
      console.error('메시지 로딩 중 오류 발생:', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  });
});

server.listen(5001, () => {
  console.log('서버가 5001번 포트에서 실행중입니다.');
});
