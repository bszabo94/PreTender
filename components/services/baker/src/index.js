const config = require('./config');
const express = require('express');
const cookieParser = require('cookie-parser');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser('darth plagueis'));

app.get('/baker/:name', function (req, res) {
    var ck = req.signedCookies[req.params.name];
    if (ck === undefined) {
        res.status(200)
            .json({ status: 0, message: "Cookie not found." });
    } else {
        res.status(200)
            .json({ status: 1, message: "Cookie found.", value: ck });
    }
});

app.post('/baker/:name/:value', function (req, res) {
    var options = {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        signed: true
    }

    res.cookie(req.params.name, req.params.value, options)
        .status(200)
        .json({ status: 1, message: "Cookie created." });
});

app.listen(config.get('port'));
