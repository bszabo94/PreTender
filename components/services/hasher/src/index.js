const config = require('./config'),
    express = require('express'),
    crypto = require('crypto'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());

const validAlgorithms = ["sha256", "md5"],
    INPUT_ENCODING = "utf-8",
    DIGEST_ENCODING = "base64";

var createHash = function (text, algorithm) {
    var hash = crypto.createHash(algorithm);
    return hash.update(text, INPUT_ENCODING).digest(DIGEST_ENCODING);
};

app.get('/hasher/:algorithm/:text', function (req, res) {
    var text = req.params.text,
        algorithm = req.params.algorithm;

    if (!validAlgorithms.includes(algorithm))
        res.status(404)
            .json(algorithm + " is not a valid algorithm.");
    else
        res.status(200)
            .json(createHash(text, algorithm));

});

app.listen(config.get('port'));