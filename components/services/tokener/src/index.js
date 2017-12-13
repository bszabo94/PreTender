const config = require('./config'),
    express = require('express'),
    jwt = require('jsonwebtoken'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());

app.get('/tokener/create/:username/:passwd', function (req, res) {
    try {
        res.status(200)
            .json({
                token: jwt.sign({ username: req.params.username }, req.params.passwd)
            });
    } catch (err) {
        res.status(404)
            .json(error.message);
    }

});

app.get('/tokener/read', function (req, res) {
    if (req.headers.token == undefined)
        res.status(404)
            .json("No token Found");

    var token = req.headers.token;

    jwt.verify(token, 'darthsidius', function (err, decode) {
        if (err) {
            res.status(404)
                .json("Could not decode JSON Web Token.");
        } else {
            res.status(200)
                .json(decode);
        }
    });
});

app.listen(config.get('port'));