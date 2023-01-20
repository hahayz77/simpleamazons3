const express = require('express');
const multer  = require('multer');
var cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
app.use(cors());
const port = 3000;
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// DATABASE ####################
const Image = require('./models/Image');



//Amazon S3 ####################
const client = new S3Client({ 
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY, 
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

//Multer ####################
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

//App Routes ####################
app.get('/', async (req, res) => {
    let imageDB = await Image.find({});
    // console.log(imagesDB);

    for(i in imageDB){
        let url = await getSignedUrl(client, new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: imageDB[i].key }), { expiresIn: 60 });
        imageDB[i].url = url;
    }
    res.send(imageDB);
});

app.post('/post', upload.single('file'), async (req,res) => {
    // console.log(req.file);
    const key = `${Date.now()}-${req.file.originalname}`;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        ContentType: req.file.mimetype,
        Body: req.file.buffer,
        Key: key
    };    
    const imageToDB = await new Image({ 
        name: req.file.originalname, 
        key: key, 
        mimetype: req.file.mimetype,
        size: req.file.size
    }).save();
    // console.log(imageToDB);

    const command = new PutObjectCommand(params);
    await client.send(command);

    res.send(key);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
});