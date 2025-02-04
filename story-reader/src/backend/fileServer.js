// filepath: /c:/Users/Admin/OneDrive - Atlantic TU/Desktop/Story-Reader/story-reader/src/backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const { MONGO_CLIENT_EVENTS } = require('mongodb');

require('dotenv').config();

const fileModel = require('./models/File');

const app = express();

const mongoURI = process.env.REACT_APP_MONGO_URL;

// Middleware
app.use(bodyParser.json());

// Init gfs
let gfs;

mongoose.connect(mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Init gfs bucket
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
   bucketName: 'fileBucket'
    });

    // Init gfs stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('files'); // collection name
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: async (req, file) => {
    try {
      const buf = await crypto.randomBytes(16);
      console.log('File:', file);
      const filename = buf.toString('hex') + path.extname(file.originalname)
      const fileInfo = {
        filename: filename,
        bucketName: 'fileBucket'
      };
      await fileModel.create(fileInfo);
      console.log('File created:', fileInfo);
      return fileInfo;
    } catch (err) {
      console.error('Error creating file:', err);
      throw err;
    }
  }
});

const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  await res.json({ file: req.file });
});

// Get all files
app.get('/files', async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    console.log('Files:', files);
    res.json(files);
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get file by filename
app.get('/file/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    console.log('File:', file);
    if (!file) { // No file exists
      return res.status(404).json({ err: 'No file exists' });
    }

    var mime = file.contentType;
    var filename = file.filename;
    res.set('Content-Type', mime);
    res.set('originalname', filename);
    
    gridfsBucket.openDownloadStream(file._id)
      .pipe(res);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));