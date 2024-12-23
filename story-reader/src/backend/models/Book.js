const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:String,
  author:String,
  year:String,
  poster:String,
  text:String,
  posterImg: { // image upload
    data: Buffer,
    contentType: String,
  },
});

const Book = mongoose.model('books', bookSchema);
module.exports = Book;