const config = require('./config');

const express = require('express');
const got = require('got');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

var getUser = function (username) {
    return got('http://' + config.get('user-url.uri') + '/user/' + username)
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not got user."
                }
            }
        });
};

var hashPwd = function (pwd) {
    return got('http://' + config.get('hasher-url.uri') + '/hasher/sha256/' + pwd)
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not hash password."
                }
            }
        });
};

var generateToken = function (username) {
    return got('http://' + config.get('tokener-url.uri') + '/tokener/create/' + username + '/' + 'darthsidius')
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not got user."
                }
            }
        });
};

var storeCookie = function (ckName, ckVal) {
    return got.post('http://' + config.get('baker-url.uri') + '/baker/' + ckName + '/' + ckVal)
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not create cookie."
                }
            }
        });
}

app.post('/login/:username/:passwd', function (req, res) {
    var username = req.params.username,
        passwd = req.params.passwd;

    getUser(username)
        .then(user => {
            user = JSON.parse(user.body);

            if (user == null) {
                res.status(200)
                    .json({ status: 0, message: "Invalid Username." })
                return;
            }

            var userpwd = user.password;
            hashPwd(passwd)
                .then(hashedPW => {
                    hashedPW = hashedPW.body.substr(1, hashedPW.body.length - 2);
                    if (hashedPW == userpwd) {
                        generateToken(username, passwd)
                            .then(token => {
                                token = JSON.parse(token.body).token;
                                storeCookie("_ujwt", token)
                                    .then(resp => {
                                        res.setHeader('set-cookie', resp.headers["set-cookie"]);
                                        res.status(200).json({ status: 1, message: "Login succesful." });
                                    })
                                    .catch(err => {
                                        throw err;
                                    });
                            })
                            .catch(err => {
                                throw err;
                            });
                    } else {
                        res.status(200)
                            .json({ status: 0, message: "Invalid Password." })
                    }
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            throw err;
        });
});

app.listen(config.get('port'));
