require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const upload = multer({ dest: 'uploads/' });

// CORS 설정
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
    if (password !== user.password) {
      // 수정: 비밀번호를 일치 여부로 직접 비교
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
    origin: '*', // 클라이언트의 주소
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'], // 이 줄을 추가하세요
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

app.post('/create-post', upload.single('image'), (req, res) => {
  const { title, content, user_id } = req.body;
  let imageUrl = null; // 이미지 URL을 null로 초기화

  // 이미지가 첨부되었을 경우에만 처리
  if (req.file) {
    const image = req.file;
    // 이미지를 라이트세일 인스턴스에 업로드하고 업로드된 파일의 URL을 얻어오는 함수 호출
    uploadToLightsail(image, (err, url) => {
      if (err) {
        console.error('Error uploading image to Lightsail:', err);
        res.status(500).send('Failed to upload image to Lightsail');
        return;
      }
      imageUrl = url; // 업로드된 파일의 URL 설정
      // 이미지 URL을 포함하여 게시글 삽입 함수 호출
      insertPost(title, content, imageUrl, user_id, res);
    });
  } else {
    // 이미지가 첨부되지 않은 경우 바로 게시글 삽입
    insertPost(title, content, imageUrl, user_id, res);
  }
});

// 게시글을 데이터베이스에 삽입하는 함수
function insertPost(title, content, imageUrl, user_id, res) {
  // 이미지 URL이 빈 경우를 처리하기 위해 imageUrl의 기본값을 설정합니다.
  imageUrl = imageUrl || '';
  // 게시글 데이터베이스에 저장
  const query = 'INSERT INTO Posts (title, content, image_url, user_id, timestamp) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [title, content, imageUrl, user_id], (error, results) => {
    if (error) {
      console.error('게시글 삽입 중 에러:', error);
      return res.status(500).send('게시글을 생성하는 동안 오류가 발생했습니다.');
    }
    res.json({ success: true, message: '게시글이 성공적으로 작성되었습니다.', imageUrl });
  });
}

// 라이트세일 인스턴스에 파일 업로드하고 업로드된 파일의 URL을 반환하는 함수
function uploadToLightsail(image, callback) {
  // 파일 이름을 유니크하게 생성
  const filename = `${uuidv4()}-${image.originalname}`;

  // AWS CLI를 사용하여 파일을 라이트세일 인스턴스에 업로드
  const command = `aws lightsail push-container-image --region <ap-northeast-2> --service-name <stellatalk2> --label ${filename} --image ${image.path}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error uploading image to Lightsail:', error);
      callback(error);
      return;
    }
    // 업로드된 파일의 URL을 생성
    const url = `<http://13.125.146.112/>/images/${filename}`;
    callback(null, url);
  });
}

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

// Express 앱에서 에러 핸들링 미들웨어 추가
app.use((error, req, res, next) => {
  console.error(error); // 에러 로깅
  res.status(500).send({ error: 'Something went wrong' }); // 클라이언트에게 적절한 에러 응답 보내기
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
