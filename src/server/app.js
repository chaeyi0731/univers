require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

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

    // 비밀번호 비교
    if (password !== user.password) {
      // 수정: 비밀번호를 일치 여부로 직접 비교
      return res.status(401).send('비밀번호가 일치하지 않습니다.');
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

// 게시글 생성 엔드포인트
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
    const url = `<http://52.79.173.63>/images/${filename}`;
    callback(null, url);
  });
}

app.get('/get', (req, res) => {
  const query = 'SELECT title FROM Posts';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
  });
});

// AWS S3 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


// multer를 사용한 파일 업로드 설정
upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'stellatalk',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
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
  console.error(error);
  res.status(500).send({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
