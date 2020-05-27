const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')
var multer = require('multer')
var sharp = require('sharp')
var bodyParser = require('body-parser')
var fs = require('fs')
const execFile = require('child_process').execFile;

var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function (req, file, cb) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb(null, file.originalname + ".png");
        }
    }
);
var upload = multer({ storage: storage });

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dhhtvk50h',
    api_key: '134763779594231',
    api_secret: '9U6mAP7axsf5QazV0-lnfpFZsdE'
})

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }))

app.post('/trim', (req, res) => {
    var { userId, lowerLimit, upperLimit, duration, url, pid } = req.body;

    if (lowerLimit == 0) {
        execFile('ffmpeg', ['-i', url, '-ss', upperLimit, '-t', duration - upperLimit, '-c', 'copy', './temp/' + userId + '-final.mp4'], (error) => {
            if (error) return res.send(error);
            cloudinary.api.delete_resources([pid],
                { resource_type: "video" }
            );
            cloudinary.uploader.upload('./temp/' + userId + '-final.mp4',
                { resource_type: "video" },
                function (err, video) {
                    if (err) return res.send(err)
                    fs.unlinkSync('./temp/' + userId + '-final.mp4')
                    res.send({ ...video, code: 'Success' });
                });
        });
    } else if (upperLimit == duration) {
        execFile('ffmpeg', ['-i', url, '-ss', 0, '-t', lowerLimit, '-c', 'copy', './temp/' + userId + '-final.mp4'], (error) => {
            if (error) return res.send(error);

            cloudinary.api.delete_resources([pid],
                { resource_type: "video" }
            );
            cloudinary.uploader.upload('./temp/' + userId + '-final.mp4',
                { resource_type: "video" },
                function (err, video) {
                    if (err) return res.send(err)
                    fs.unlinkSync('./temp/' + userId + '-final.mp4')
                    res.send({ ...video, code: 'Success' });
                });
        });
    } else {
        execFile('ffmpeg', ['-i', url, '-ss', 0, '-t', lowerLimit, '-c', 'copy', './temp/' + userId + '-p1.mp4'], (error) => {
            if (error) return res.send(error);
            execFile('ffmpeg', ['-i', url, '-ss', upperLimit, '-t', duration - upperLimit, '-c', 'copy', './temp/' + userId + '-p2.mp4'], (error) => {
                if (error) return res.send(error);

                fs.writeFile("./temp/" + userId + '.txt', "file '" + userId + '-p1.mp4' + "'\nfile '" + userId + '-p2.mp4' + "'", function (err) {
                    if (err) return res.send(err);
                    execFile('ffmpeg', ['-f', 'concat', '-i', './temp/' + userId + '.txt', '-c', 'copy', './temp/' + userId + '-final.mp4'], (error) => {
                        if (error) return res.send(error);
                        cloudinary.api.delete_resources([pid],
                            { resource_type: "video" }
                        );
                        cloudinary.uploader.upload('./temp/' + userId + '-final.mp4',
                            { resource_type: "video" },
                            function (err, video) {
                                if (err) return res.send(err)
                                fs.unlinkSync('./temp/' + userId + '-final.mp4')
                                fs.unlinkSync('./temp/' + userId + '-p1.mp4')
                                fs.unlinkSync('./temp/' + userId + '-p2.mp4')
                                fs.unlinkSync('./temp/' + userId + '.txt')
                                res.send({ ...video, code: 'Success' });
                            });
                    });
                });
            });
        });
    }
})

app.post('/watermark', upload.single('logo'), (req, res) => {

    sharp("./uploads/" + req.body.userId + ".png")
        .resize({ width: 200 })
        .toFile("./uploads/" + req.body.userId + "-2.png")
        .then(() => {
            fs.unlink("./uploads/" + req.body.userId + ".png", () => { });
            // Add New Logo To Video
            const str = "[1]lut=a=val*0.8[a];[0][a]overlay=main_w-overlay_w-20:main_h-overlay_h-30";
            execFile('ffmpeg', ['-i', req.body.vid_url, '-i', "./uploads/" + req.body.userId + "-2.png", '-filter_complex', str, '-preset', "ultrafast", '-c:a', 'copy', "./uploads/" + req.body.userId + ".mp4"], (error, stdout, stderr) => {
                if (error) return res.send(error);
                fs.unlink("./uploads/" + req.body.userId + "-2.png", () => { });
                // Upload new video to cloudinary
                cloudinary.api.delete_resources([req.body.pid],
                    { resource_type: "video" }
                );
                cloudinary.uploader.upload('./uploads/' + req.body.userId + '.mp4',
                    { resource_type: "video" },
                    function (err, video) {
                        if (err) return res.send(err)
                        fs.unlink('./uploads/' + req.body.userId + '.mp4', () => { });
                        res.send({ ...video, code: 'Success' });
                    });
            });
        });

})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))