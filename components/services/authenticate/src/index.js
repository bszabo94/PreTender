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
    return got('http://' + config.get('tokener-url.uri') + '/tokener/read', { headers: { 'token': token } })
        .then(res => {
            return res.body;
        })
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not read token."
                }
            };
        });
};

var checkUserExists = function (username) {
    return got('http://' + config.get('user-url.uri') + '/user/' + username)
        .then(resp => {
            if (JSON.parse(resp.body) != null) {
                return true;
            } else {
                return false;
            }
        })
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not use user-exist service."
                }
            }
        });
};

app.get('/auth', function (req, res) {
    var ck = req.signedCookies["_ujwt"];
    if (ck === undefined) {
        res.status(401)
            .json({ status: 0, message: "Authorization required." });
    } else {
        readToken(ck)
            .then(token => {
                var user = JSON.parse(token)["username"];
                checkUserExists(user)
                    .then(check => {
                        if (check) {
                            res.status(200)
                                .json({ status: 1, message: "Authorization OK.", user: user });
                        } else {
                            res.status(401)
                                .json({ status: 0, message: "Authorization required." });
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json();
                // res.status(err.status)
                //     .json(err.payload);
            });
    }
});

app.listen(config.get('port'));
