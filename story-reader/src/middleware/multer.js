const { text } = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const gridFsStorage = require('multer-gridfs-storage');

const storage = new gridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },  
  file: (req, file) => {
      const match = ['image/png', 'image/jpeg'];

      if (match.indexOf(file.mimetype) === -1) {
        const filename = `${Date.now()}-story-reader-${file.originalname}`;
        return filename;
      }

      return {
          bucketName: 'photos',
          filename: `${Date.now()}-story-reader-${file.originalname}`
      };
  },
});

module.exports = multer({ storage });