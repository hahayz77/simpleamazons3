const mongoose = require('../mongodb');

const ImageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    key: {
        type: String,
        unique: true
    },
    url: {
        type: String
    },
    mimetype: {
        type: String
    },
    size: {
        type: Number
    }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;