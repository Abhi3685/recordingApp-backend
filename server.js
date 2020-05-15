const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }))

app.post('/upload', (req, res) => {
    req.body.data = req.body.data.replace(/^data:(.*?);base64,/, "");
    req.body.data = req.body.data.replace(/ /g, '+');

    fs.appendFile('./uploads/' + req.body.name, req.body.data, 'base64', function (err) {
        if (err) console.log(err);
    });
    res.status(200).send('Success!');
})

app.get('/test', (req, res) => {
    var startTime = 10;
    var endTime = 20;
    var filename = 'sample.mp4';

    ffmpeg('./uploads/' + filename)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output('./uploads/trim.mp4')
        .on('error', function (err, stdout, stderr) {
            res.send('Cannot process video: ' + err.message);
        })
        .on('end', function (stdout, stderr) {
            res.send('Trimming succeeded !');
        })
        .run();
})

app.get('/video', function (req, res) {
    const path = './uploads/1-1589466481826.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))