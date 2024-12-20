/*
    Express.js allows for easy creation of a server that 
    handles routes and uses URL params
*/
require('dotenv').config();
const express = require('express');
const app = express();

// multer allows for image upload
const multer = require("multer");

/* 
    cors is a middleware that defines what a ips are allowed to communicate
    with the server. Protects against DOS attacks, etc.
*/
const cors = require('cors');
app.use(cors());

// cors enabled for given client requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
    In post http requests, the data is returned in the body of the response.
    BodyParser allows for us to parse the returned data easily,
    in json in this case
*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the database using mongoose
const mongoose = require('mongoose');

// mongoose.connect(process.env.REACT_APP_MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.REACT_APP_MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// get book model
const bookModel = require('./models/Book');
const Book = require('./models/Book');

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