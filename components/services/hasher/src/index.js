const config = require('./config');
const express = require('express');
var crypto = require('crypto');
var cors = require('cors');

var validAlgorithms = ["sha256", "md5"];
const INPUT_ENCODING = "utf-8";
const DIGEST_ENCODING = "base64";

var createHash = function (text, algorithm) {
    var hash = crypto.createHash(algorithm);
    return hash.update(text, INPUT_ENCODING).digest(DIGEST_ENCODING);
};

var app = express();
app.use(express.json());
app.use(cors());

app.get('/hasher/:algorithm/:text', function (req, res) {
    var text = req.params.text,
        algorithm = req.params.algorithm;

    if (!validAlgorithms.includes(algorithm))
        res.status(400).json({ message: algorithm + " is not a valid algorithm." });
    else
        res.status(200).json(createHash(text, algorithm));

});


app.listen(config.get('port'));
