const express = require('express');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const port = 3000;

const app = express();

app.get('/', (req, res) => {
  res.json({response:'Hello World!'})
});

app.post('/post', upload.single('file'), (req,res)=>{
    console.log(req.file);
    res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
});