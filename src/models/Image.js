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
    },
    time: {
        type: Date,
        default: Date.now,
    }
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;