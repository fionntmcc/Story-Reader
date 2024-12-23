require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');

const app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// cors enabled for given client requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// init gfs
let gfs;

mongoose.connect(process.env.REACT_APP_MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // init gfs stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('photos'); // collection name
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// multer setup for file upload
const storage = new GridFsStorage({
  url: process.env.REACT_APP_MONGO_URL,
  file: (req, file) => {
    console.log('!!!file: ', file);
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log('Error generating random bytes:', err);
          return reject(err);
        }
        const name = buf.toString('hex') + path.extname(file.name);
        const fileInfo = {
          name: name,
          bucketName: 'files'
        };
        resolve(fileInfo);
      });
    });
  }
});

// get mongoose models
const bookModel = require('./models/Book');
const fileModel = require('./models/File');

const upload = multer({ storage });

app.delete('/file/:filename', async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/file/:name', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.name });
    const result = [];

    await gfs.createReadStream(file)
    .pipe()
    .on('data', (chunk) => {
      result.push(chunk);
    })
    .on('end', () => {
      console.log('File fetched successfully');
      res.send(Buffer.concat(result));
    }
    );
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/file/:name', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ name : req.params.name });
    console.log('file: ', file);
    const readStream = gfs.createReadStream(file.name);
    readStream.pipe(res);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/file/upload', upload.single('img'), async (req, res) => {
  if (req.file === undefined) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const newFile = new fileModel({
    data: req.file.buffer,
    contentType: req.file.mimetype,
  });

  try {
    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Error uploading file:', error);
    console.log("req.file: ", req.file);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/books', async (req, res) => {
  const books = await bookModel.find({});
  res.status(200).json({ books })
});

app.get('/api/book/:id', async (req, res) => {
  const book = await bookModel.findById(req.params.id);
  res.json(book);
})

app.post('/api/books', upload.single('posterImg'), async (req, res) => {
  /*
      The bodyParser middleware allows for access to the body of a post.
      This is necessary because unlike the get method, data
      is returned in the body, and not the URL.
  */
  const { title, author, year, poster, text } = req.body;
  const posterImg = req.file
    ? {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    }
    : null;

  const newBook = new bookModel({
    title,
    author,
    year,
    poster,
    text,
    posterImg,
  });
  await newBook.save();

  res.status(201).json({ "message": "Book Added!", Book: newBook });
})

// Fetches the specific book's info.
// Takes updated details from req.body 
// and updates the book in the DB.
// returns updated book to confirm the change.

app.get('/api/book/:id', async (req, res) => {
  let book = await bookModel.findById({ _id: req.params.id });
  console.log('sending book with id: ', req.params.id);
  console.log('Book: ', book);
  res.send(book);
});

app.get('/api/random/book', async (req, res) => {
  try {
    const count = await bookModel.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomBook = await bookModel.findOne().skip(random);
    res.status(200).json(randomBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Updates the  specific book's info.
// User submits the edited data.
// Route takes the updated details from req.body.
// Updates the book in the DB.
// Returns updated book to confirm the change.
// Update a book by ID in MongoDB
app.put("/api/book/:id", upload.single("posterImg"), async (req, res) => {
  try {
    const { title, author, year, poster, text } = req.body;
    const posterImg = req.file
      ? {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
      : null;

    // update the book on database
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        year,
        poster,
        text,
        posterImg,
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error); // Detailed error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Deletes the specific book from the database
// deletes by id
/**
 * @param {string} req.params.id - The ID of the book to delete
 */
app.delete('/api/book/:id', async (req, res) => {

  console.log('Deleting book with ID:', req.params.id);
  const book = await bookModel.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Book deleted successfully", book });
});

app.listen(process.env.REACT_APP_SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.REACT_APP_SERVER_PORT}`);
});