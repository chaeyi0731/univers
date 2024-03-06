require('dotenv').config({ path: '../../.env' });
//환경변수 확인!!
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // saltRounds는 해싱 계산에 사용되는 복잡성을 결정합니다.

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const mysql = require('mysql');

const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

//? db
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//? db 연결
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database.');
});

//? 회원가입 API
app.post('/signup', async (req, res) => {
  const { username, password, name, phoneNumber, address } = req.body;

  try {
    // 비밀번호를 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 해싱된 비밀번호를 사용하여 사용자 등록
    const query = 'INSERT INTO Users (username, password, name, phone_number, address) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, hashedPassword, name, phoneNumber, address], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error during signup');
        return;
      }
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    console.error('Error hashing password', error);
    res.status(500).send('Error during signup');
  }
});

//? 로그인 API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
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

    // 데이터베이스에 저장된 해시와 비밀번호 비교
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).send('비밀번호가 일치하지 않습니다.');
      return;
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ success: true, token, user: { name: user.name, username: user.username } });
  });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // 토큰이 없으면 인증 실패

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않으면 액세스 거부
    req.user = user;
    next(); // 다음 미들웨어로 이동
  });
};

app.get('/some-protected-route', authenticateToken, (req, res) => {
  res.json({ message: '이 경로는 보호됩니다.' });
});

app.get('/api/verifyToken', authenticateToken, (req, res) => {
  // authenticateToken 미들웨어를 통과한 후, req.user에는 토큰에서 추출한 사용자 정보가 담겨 있음
  const userId = req.user.id; // 토큰에서 추출한 사용자 ID

  // 사용자 ID를 사용하여 데이터베이스에서 사용자 정보 조회
  // 컬럼 이름을 'id'에서 'user_id'로 변경
  const query = 'SELECT user_id, username, name FROM Users WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('서버 오류');
    }

    if (results.length === 0) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 사용자 정보를 찾은 경우, 사용자 정보를 응답으로 반환
    const user = results[0];
    res.json({ user });
  });
});

//? logout API
app.post('/api/logout', (req, res) => {
  res.send({ success: true, message: 'Successfully logged out' });
});

//? 채팅관련 API

//? 소켓 관련

const io = require('socket.io')(server, {
  cors: {
    origin: `${process.env.REACT_APP_API_URL}`,
    methods: ['GET', 'POST'], // 허용할 HTTP 메소드
  },
});

// 클라이언트로부터 메시지를 받는 이벤트 리스너
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('Message from user:', msg);

    // 메시지를 데이터베이스에 저장
    const query = 'INSERT INTO chatMessage (username, message, timestamp, user_id) VALUES (?, ?, ?, ?)';
    // 여기서 msg.username으로 수정
    db.query(query, [msg.username, msg.text, msg.timestamp, msg.user_id], (err, result) => {
      if (err) {
        console.error('Error saving message:', err);
        return;
      }
      console.log('Message saved:', result);
      // 메시지를 모든 클라이언트에게 전송
      io.emit('chat message', msg);
    });
  });
});

app.get('/api/messages', (req, res) => {
  const query = 'SELECT * FROM chatMessage ORDER BY timestamp DESC LIMIT 50';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

//? 게시글 작성 api

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

app.get('/posts', (req, res) => {
  const query = `
  SELECT 
  Posts.post_id, 
  Posts.title, 
  Users.name, 
  Posts.timestamp
FROM Posts
JOIN Users ON Posts.user_id = Users.user_id
ORDER BY Posts.timestamp DESC;

  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    res.json(results);
  });
});

//? 게시글 상세보기

app.get('/posts/:postId', (req, res) => {
  const { postId } = req.params;
  const query = `
    SELECT Posts.post_id, Posts.title, Posts.content, Posts.image_url, Posts.timestamp, Users.username
    FROM Posts
    JOIN Users ON Posts.user_id = Users.user_id
    WHERE Posts.post_id = ?
  `;

  db.query(query, [postId], (error, results) => {
    if (error) {
      console.error('Error fetching post details:', error);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      const post = results[0];
      post.image_url = post.image_url || null; // 이미지 URL이 없는 경우 null 처리
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  });
});

//? 댓글 랜더링 API
app.get('/comments', (req, res) => {
  // 쿼리 파라미터에서 post_id를 추출합니다.
  const post_id = req.query.post_id;

  if (!post_id) {
    // post_id가 없는 경우, 클라이언트에게 에러 메시지를 보냅니다.
    return res.status(400).send('post_id query parameter is required');
  }

  // 데이터베이스 쿼리를 준비합니다.
  const query = `
    SELECT Comments.comment_id, Comments.content, Comments.timestamp, Users.name
    FROM Comments
    JOIN Users ON Comments.user_id = Users.user_id
    WHERE Comments.post_id = ?
    ORDER BY Comments.timestamp DESC
  `;

  // 데이터베이스 쿼리를 실행합니다.
  db.query(query, [post_id], (error, comments) => {
    if (error) {
      // 쿼리 실행 중 에러가 발생한 경우, 에러 메시지를 보냅니다.
      console.error('Error fetching comments:', error);
      return res.status(500).send('Server error');
    }

    // 쿼리 결과를 클라이언트에게 JSON 형식으로 보냅니다.
    res.json(comments);
  });
});

//댓글 추가 API
app.post('/comments', (req, res) => {
  const { post_id, user_id, content } = req.body;

  const insertQuery = `
    INSERT INTO Comments (post_id, user_id, content, timestamp)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(insertQuery, [post_id, user_id, content], (error, result) => {
    if (error) {
      console.error('Error posting new comment:', error);
      return res.status(500).send('Server error');
    }

    const commentId = result.insertId;
    const selectQuery = `
      SELECT comment_id, content, timestamp, user_id
      FROM Comments
      WHERE comment_id = ?
    `;

    db.query(selectQuery, [commentId], (error, comments) => {
      if (error) {
        console.error('Error fetching new comment:', error);
        return res.status(500).send('Server error');
      }

      res.json(comments[0]);
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`서버가 실행 되고 있습니다. 포트: ${PORT}.`);
});
