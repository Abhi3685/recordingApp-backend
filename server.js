const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs')
const execFile = require('child_process').execFile;

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dhhtvk50h',
    api_key: '134763779594231',
    api_secret: '9U6mAP7axsf5QazV0-lnfpFZsdE'
})

app.use(cors())
app.use(express.static('subtitles'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }))

app.post('/trim', (req, res) => {
    var { userId, lowerLimit, upperLimit, duration, url, pid } = req.body;

    if (lowerLimit == 0) {
        execFile('ffmpeg', ['-ss', upperLimit, '-i', url, '-t', duration - upperLimit, '-c', 'copy', './temp/' + userId + '-final.mkv'], (error) => {
            if (error) return res.send(error);
            cloudinary.uploader.upload('./temp/' + userId + '-final.mkv',
                { resource_type: "video" },
                function (err, video) {
                    if (err) return res.send(err)
                    fs.unlinkSync('./temp/' + userId + '-final.mkv')
                    res.send({ ...video, code: 'Success' });
                });
            cloudinary.api.delete_resources([pid],
                { resource_type: "video" }
            );
        });
    } else if (upperLimit == duration) {
        execFile('ffmpeg', ['-ss', 0, '-i', url, '-t', lowerLimit, '-c', 'copy', './temp/' + userId + '-final.mkv'], (error) => {
            if (error) return res.send(error);

            cloudinary.api.delete_resources([pid],
                { resource_type: "video" }
            );
            cloudinary.uploader.upload('./temp/' + userId + '-final.mkv',
                { resource_type: "video" },
                function (err, video) {
                    if (err) return res.send(err)
                    fs.unlinkSync('./temp/' + userId + '-final.mkv')
                    res.send({ ...video, code: 'Success' });
                });
        });
    } else {
        execFile('ffmpeg', ['-ss', 0, '-i', url, '-t', lowerLimit, '-c', 'copy', './temp/' + userId + '-p1.mkv'], (error) => {
            if (error) return res.send(error);
            execFile('ffmpeg', ['-ss', upperLimit, '-i', url, '-t', duration - upperLimit, '-c', 'copy', './temp/' + userId + '-p2.mkv'], (error) => {
                if (error) return res.send(error);

                fs.writeFile("./temp/" + userId + '.txt', "file '" + userId + '-p1.mkv' + "'\nfile '" + userId + '-p2.mkv' + "'", function (err) {
                    if (err) return res.send(err);
                    execFile('ffmpeg', ['-f', 'concat', '-i', './temp/' + userId + '.txt', '-c', 'copy', './temp/' + userId + '-final.mkv'], (error) => {
                        if (error) return res.send(error);
                        cloudinary.api.delete_resources([pid],
                            { resource_type: "video" }
                        );
                        cloudinary.uploader.upload('./temp/' + userId + '-final.mkv',
                            { resource_type: "video" },
                            function (err, video) {
                                if (err) return res.send(err)
                                fs.unlinkSync('./temp/' + userId + '-final.mkv')
                                fs.unlinkSync('./temp/' + userId + '-p1.mkv')
                                fs.unlinkSync('./temp/' + userId + '-p2.mkv')
                                fs.unlinkSync('./temp/' + userId + '.txt')
                                res.send({ ...video, code: 'Success' });
                            });
                    });
                });
            });
        });
    }
})

app.post('/subtitle', (req, res) => {
    var { file, text } = req.body;
    fs.writeFileSync("./subtitles/" + file, text);
    res.send("Success!");
})

app.delete('/video/:videoId', (req, res) => {
    var publicId = req.params.videoId;
    cloudinary.api.delete_resources([publicId],
        { resource_type: "video" }
    );
    res.send('Success!');
})

app.post("/deletepost", (req, res) => {
    req.body.attachments.forEach(attachment => {
        var parts = attachment.split("/");
        parts = parts[parts.length - 1].split(".");
        if (parts[1] === 'jpg' || parts[1] === 'png') {
            cloudinary.api.delete_resources([parts[0]]);
        } else {
            cloudinary.api.delete_resources([parts[0]],
                { resource_type: "video" }
            );
        }
    });
    res.send('Success!');
})

app.get('/', (req, res) => {
    cloudinary.uploader.upload('./temp/xyz-final.mkv',
        { resource_type: "video" },
        function (err, video) {
            if (err) return res.send(err)
            // fs.unlinkSync('./temp/' + userId + '-final.mp4')
            res.send({ ...video, code: 'Success' });
        });
    // res.send('Hello World!');
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))