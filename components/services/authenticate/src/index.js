const config = require('./config');

const express = require('express');
const got = require('got');
const cookieParser = require('cookie-parser');

var app = express();
app.use(express.json());
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
    return got('http://' + config.get('user-exists-check-url.uri') + '/checkuserexists/' + username)
        .then(resp => {
            if (JSON.parse(resp.body).status) {
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
                                .json({ status: 1, message: "Authorization OK." });
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
                res.status(err.status)
                    .json(err.payload);
            });
    }
});

app.listen(config.get('port'));