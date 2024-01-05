const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// 配置 Multer 的存儲選項
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/beat/');
  },
  filename: function(req, file, cb) {
      cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload-beat', upload.single('beatFile'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ path: '/beat/' + file.filename }); // 回傳文件路徑
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
