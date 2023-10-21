require('dotenv').config();
require('dotenv').config();
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin', require('./routes/admin'));

app.get('/', (req, res)=> res.json({response: "Api masterClin"}));

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
});