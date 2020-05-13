const express = require('express')
const app = express()
const port = 8000
var cors = require('cors')
var bodyParser = require('body-parser')
var fs = require('fs')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }))

app.post('/upload', (req, res) => {
    req.body.data = req.body.data.replace(/^data:(.*?);base64,/, "");
    req.body.data = req.body.data.replace(/ /g, '+');

    fs.appendFile(`./uploads/sample.mp4`, req.body.data, 'base64', function (err) {
        if (err) console.log(err);
    });
    res.status(200).send('Success!');
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))