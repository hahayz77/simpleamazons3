const mongoose = require('mongoose');
require('dotenv').config();


mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_HOST,
{
    useNewUrlParser: true

});

mongoose.Promise = global.Promise;

module.exports = mongoose;