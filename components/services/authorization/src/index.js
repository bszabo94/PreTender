const config = require('./config');

const express = require('express'),
    got = require('got'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser('darth plagueis'));

var readToken = function (token) {
    return got('http://' + config.get('tokener.url') + '/tokener/read', { headers: { 'token': token } })
        .then(res => {
            return res.body;
        })
        .catch(err => {
            throw err;
        });
};

var checkUserExists = function (username) {
    return got('http://' + config.get('user.url') + '/user/' + username)
        .then(resp => {
            return JSON.parse(resp.body) != null;
        })
        .catch(err => {
            throw err;
        });
};

app.get('/auth', function (req, res) {
    var ck = req.signedCookies["_ujwt"], user;
    if (ck === undefined) {
        res.status(403)
            .json({ status: 0, message: "Authorization required." });
    } else {
        readToken(ck)
            .then(token => {
                user = JSON.parse(token)["username"];
                checkUserExists(user)
                    .then(check => {
                        if (check) {
                            res.status(200)
                                .json({ status: 1, message: "Authorization OK.", user: user });
                        } else {
                            res.status(403)
                                .json({ status: 0, message: "Authorization required." });
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                res.status(404)
                    .json(err.message);
            });
    }
});

app.listen(config.get('port'));