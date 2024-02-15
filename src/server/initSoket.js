const { Server } = require('socket.io');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://13.125.146.112', // 클라이언트 주소
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
    transports: ['websocket'],
  });

  io.of('/chatting').on('connection', (socket) => {
    console.log('새로운 클라이언트가 /chatting에서 연결되었습니다:', socket.id);

    socket.on('chat message', (msg) => {
      io.of('/chatting').emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('클라이언트가 /chatting에서 연결을 끊었습니다:', socket.id);
    });
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
}

module.exports = initSocket;
