//환경변수 가져오기
require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
<<<<<<< HEAD
<<<<<<< HEAD
=======
const AWS = require('aws-sdk');
>>>>>>> 03ceb55 (:pencil2: Rename: 변수명 변경)
=======
>>>>>>> 97a8a7b (:bug: Fix: 스토리지 사용하지 않아서 삭제)
const { v4: uuidv4 } = require('uuid');
<<<<<<< HEAD
<<<<<<< HEAD
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
=======
const AWS = require('aws-sdk');
const fs = require('fs');

<<<<<<< HEAD
const s3 = new AWS.S3({
>>>>>>> 2199c46 (:hammer: Modify: s3 사용)
=======
AWS.config.update({
>>>>>>> e6f4545 (:hammer: Modify: 여러가지 문제 해결)
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
<<<<<<< HEAD

const s3 = new AWS.S3();
=======
const { exec } = require('child_process');
>>>>>>> fca82b4 (:bug: Fix: 게시글을 라이트세일 인스턴스에서 url을 받아와서 저장하기)

const s3 = new AWS.S3();

const upload = multer({ dest: 'uploads/' });

<<<<<<< HEAD
=======
const upload = multer({ dest: 'uploads/' });

// CORS 설정
>>>>>>> 03ceb55 (:pencil2: Rename: 변수명 변경)
=======

const upload = multer({ dest: 'uploads/' });

>>>>>>> 2199c46 (:hammer: Modify: s3 사용)
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
      return;
    }
    res.status(201).send('User registered successfully');
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 오류');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('사용자를 찾을 수 없습니다.');
      return;
    }
    const user = results[0];
<<<<<<< HEAD
<<<<<<< HEAD
    if (password !== user.password) {
      res.status(401).send('비밀번호가 일치하지 않습니다.');
      return;
=======

    // 비밀번호 비교
    if (password !== user.password) {
      // 수정: 비밀번호를 일치 여부로 직접 비교
      return res.status(401).send('비밀번호가 일치하지 않습니다.');
>>>>>>> adb757e (:bug: Fix : 사소한 버그정리)
=======
    if (password !== user.password) {
      res.status(401).send('비밀번호가 일치하지 않습니다.');
      return;
>>>>>>> 2199c46 (:hammer: Modify: s3 사용)
    }
    res.send({ success: true, user });
  });
});

app.post('/api/logout', (req, res) => {
  res.send({ success: true, message: 'Successfully logged out' });
});

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다:', socket.id);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    const query = 'INSERT INTO chatMessage (userName, message, timestamp) VALUES (?, ?, ?)';
    db.query(query, [msg.userName, msg.text, msg.timestamp], (err, result) => {
      if (err) {
        console.error('메시지 저장 중 오류 발생:', err);
      } else {
        console.log('메시지가 데이터베이스에 저장되었습니다:', result.insertId);
      }
    });
  });
  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 끊었습니다:', socket.id);
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

<<<<<<< HEAD
<<<<<<< HEAD
app.post('/create-post', upload.single('image'), (req, res) => {
  const { title, content, user_id } = req.body; // user_id 추가
  let imageUrl = null; // 이미지 URL 초기화

  if (req.file) {
    const image = req.file;
    const fileContent = fs.readFileSync(image.path);
    const filename = `${uuidv4()}-${image.originalname}`;
    s3.upload(
      {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `image/${filename}`,
        Body: fileContent,
        ACL: 'public-read',
      },
      (error, data) => {
        if (error) {
          console.error('Error uploading image to S3:', error);
          res.status(500).send('Failed to upload image to S3');
          return;
        }
        imageUrl = data.Location;
        insertPost(title, content, imageUrl, user_id, res); // 게시글 삽입 함수 호출
      }
    );
  } else {
    insertPost(title, content, null, user_id, res); // 이미지가 없는 경우
  }
});

function insertPost(title, content, imageUrl, user_id, res) {
  const query = 'INSERT INTO Posts (title, content, image_url, user_id, timestamp) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [title, content, imageUrl, user_id], (error, results) => {
    if (error) {
      console.error('게시글 삽입 중 에러:', error);
      res.status(500).send('게시글을 생성하는 동안 오류가 발생했습니다.');
      return;
    }
    res.json({ success: true, message: '게시글이 성공적으로 작성되었습니다.', imageUrl });
  });
}
=======
>>>>>>> 2199c46 (:hammer: Modify: s3 사용)

});
=======
>>>>>>> e6f4545 (:hammer: Modify: 여러가지 문제 해결)
app.post('/create-post', upload.single('image'), (req, res) => {
  const { title, content, user_id } = req.body; // user_id 추가
  let imageUrl = null; // 이미지 URL 초기화

  if (req.file) {
    const image = req.file;
    const fileContent = fs.readFileSync(image.path);
    const filename = `${uuidv4()}-${image.originalname}`;
    s3.upload(
      {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `image/${filename}`,
        Body: fileContent,
        ACL: 'public-read',
      },
      (error, data) => {
        if (error) {
          console.error('Error uploading image to S3:', error);
          res.status(500).send('Failed to upload image to S3');
          return;
        }
        imageUrl = data.Location;
        insertPost(title, content, imageUrl, user_id, res); // 게시글 삽입 함수 호출
      }
    );
  } else {
    insertPost(title, content, null, user_id, res); // 이미지가 없는 경우
  }
});

function insertPost(title, content, imageUrl, user_id, res) {
  const query = 'INSERT INTO Posts (title, content, image_url, user_id, timestamp) VALUES (?, ?, ?, ?, NOW())';
  db.query(query, [title, content, imageUrl, user_id], (error, results) => {
    if (error) {
      console.error('게시글 삽입 중 에러:', error);
      res.status(500).send('게시글을 생성하는 동안 오류가 발생했습니다.');
      return;
    }
    res.json({ success: true, message: '게시글이 성공적으로 작성되었습니다.', imageUrl });
  });
}

app.get('/posts', async (req, res) => {
  const query = `
    SELECT 
      Posts.id, 
      Posts.title, 
      Users.username, 
      Posts.timestamp
    FROM Posts
    JOIN Users ON Posts.user_id = Users.id
    ORDER BY Posts.timestamp DESC
  `;
  try {
    const [results] = await db.promise().query(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
