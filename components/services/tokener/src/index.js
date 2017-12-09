const config = require('./config');
const express = require('express');
const jwt = require('jsonwebtoken');

var app = express();
app.use(express.json());

app.get('/tokener/:username/:passwd', function (req, res) {
    res.status(200)
        .json({
            token: jwt.sign({ username: req.params.username }, req.params.passwd)
        });
});

app.listen(config.get('port'));