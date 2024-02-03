// sever/app,js
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'stellatalk.cliyuoye061h.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
  password: 'zico920914',
  database: 'stellatalk',
});

db.connect((err) => {
  if (err) {
    console.error('연결 에러:', err);
    return;
  }
  console.log('MySQL에 연결됨');
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
const io = socketIo(server, {
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

// 게시글 제목 목록을 불러오는 GET 엔드포인트
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
AWS.config.update({
  accessKeyId: 'AKIA6L5TGMGL4ZJRSI6X', // AWS IAM 사용자의 액세스 키 ID
  secretAccessKey: '76UaS8mk5tO5i/b3Vek+lea2rndFEXFrIJvixUQO', // AWS IAM 사용자의 시크릿 액세스 키
  region: 'ap-northeast-2', // 서울
});

const s3 = new AWS.S3();

// multer를 사용한 파일 업로드 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'stllatalk', // S3 버킷 이름
    acl: 'public-read', // 업로드된 파일의 ACL(접근 권한)
    key: function (request, file, cb) {
      // 'image/' 폴더 내에 파일 저장
      const filename = `${Date.now().toString()}-${file.originalname}`;
      const fullPath = `image/${filename}`; // 'image' 폴더 안에 파일 저장
      cb(null, fullPath);
    },
  }),
}).single('image');

app.post('/create-post', (req, res) => {
  const { title, content, user_id, image_url } = req.body;
  const sql = 'INSERT INTO Posts (title, content, user_id, image_url) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, content, user_id, image_url], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 에러가 발생했습니다.');
    } else {
      res.send('게시글이 성공적으로 작성되었습니다.');
    }
  });
});

server.listen(5001, () => {
  console.log('서버가 5001번 포트에서 실행중입니다.');
});
