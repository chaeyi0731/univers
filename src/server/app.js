// sever/app,js
require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const mysql = require('mysql');

// CORS 설정
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // 수정됨
  database: process.env.DB_DATABASE, // 수정됨
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database.');
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

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000', // 클라이언트의 주소
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

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
    const query = 'INSERT INTO chatMessage (userName, message, timestamp) VALUES (?, ?, ?)';
    db.query(query, [msg.userName, msg.text, msg.timestamp], (err, result) => {
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

//? 게시판 게시글 관련 API

app.get('/get', (req, res) => {
  const query = 'SELECT title FROM Posts'; // 게시글 제목을 가져오는 쿼리 (테이블 이름과 컬럼 이름 확인 필요)
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results.map((result) => result.title)); // 각 게시글의 제목만 배열로 반환
    }
  });
});

// AWS S3 설정
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer를 사용하여 이미지 업로드 설정
const upload = multer({
  storage: multer.memoryStorage(),
}).single('image');

// 이미지 업로드 및 URL 생성 라우트
app.post('/upload-image', upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지를 업로드해주세요.' });
  }

  // S3에 이미지 업로드
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    ACL: 'public-read',
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('S3 업로드 실패:', err);
      return res.status(500).json({ message: '이미지 업로드 중 오류가 발생했습니다.' });
    }

    // 업로드된 이미지 URL 반환
    const imageUrl = data.Location;
    return res.status(200).json({ imageUrl });
  });
});

app.post('/create-post', upload.single('image'), (req, res) => {
  // req.body에서 게시글 정보를 추출합니다.
  const { title, content, user_id } = req.body;

  // 이미지 파일이 업로드 되었다면, S3에서 반환된 파일의 URL을 사용합니다.
  // 업로드된 파일이 없다면, image_url은 null이 됩니다.
  const image_url = req.file ? req.file.location : null;

  // 게시글 정보와 이미지 URL(있는 경우)을 데이터베이스에 저장합니다.
  const query = `
    INSERT INTO Posts (user_id, title, content, image_url, timestamp) 
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [user_id, title, content, image_url], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    // 성공적으로 게시글이 생성되었을 때의 응답입니다.
    res.send({ message: 'Post created successfully', postId: result.insertId });
  });
});

app.use((error, req, res, next) => {
  console.error(error); // 에러 로깅
  res.status(500).send({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
