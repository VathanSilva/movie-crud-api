// multerConfig.js
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // This sets the destination folder to 'uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // This keeps the original filename for the uploaded file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
