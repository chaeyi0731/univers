const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001; // 포트 변경 가능

const cors = require('cors');
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
