const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({ // file upload
    name : String,
    bucketName: String,
});

const File = mongoose.model('files', fileSchema);
module.exports = File;