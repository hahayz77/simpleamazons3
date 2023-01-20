const express = require('express');
const multer  = require('multer');
require('dotenv').config();
const app = express();
const port = 3000;
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


const client = new S3Client({ 
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY, 
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

const storage = multer.memoryStorage();
const upload = multer({ 
    dest: 'uploads/', 
    storage: storage, //If the storage option is here no data is written to disk but data is kept in a buffer accessible in the file object.
    limits: {fileSize: 2 * 1024 * 1024}, // Ex => 1 * 1024 * 1024 = 1MB
    fileFilter: (req, file, cb) => {    // Image type permission
        const allowedMimes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else{
            cb(new Error("Invalid image  type!"));
        }
    }
});

app.get('/', (req, res) => {
    res.json({response:'Hello World!'})
});

app.post('/post', upload.single('file'), async (req,res) => {
    console.log(req.file);
    const key = `${Date.now()}-${req.file.originalname}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        Key: key
    };    
    const command = new PutObjectCommand(params);
    await client.send(command);

    res.send(key);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
});