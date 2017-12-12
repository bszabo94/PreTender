const config = require('./config');
const express = require('express');
const jwt = require('jsonwebtoken');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

app.get('/tokener/create/:username/:passwd', function (req, res) {
    res.status(200)
        .json({
            token: jwt.sign({ username: req.params.username }, req.params.passwd)
        });
});

app.get('/tokener/read', function (req, res) {
    if (req.headers.token === undefined)
        res.status(400)
            .json("No token Found");


    var token = req.headers.token;
    jwt.verify(token, 'darthsidius', function (err, decode) {
        if (err) {
            res.status(400)
                .json("Could not decode JSON Web Token.");
        } else {
            res.status(200)
                .json(decode);
        }
    });
});

app.listen(config.get('port'));
