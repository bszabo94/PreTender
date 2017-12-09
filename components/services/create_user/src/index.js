const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');

var app = express();
app.use(express.json());

var newUser =
    {
        "username": "",
        "password": "",
        "role": "registered",
        "profile": {
            "firstname": "",
            "lastname": "",
            "birth date": "",
            "place of birth": "",
            "nationality": "",
            "email": "",
            "address": {
                "postcode": 0,
                "country": "",
                "city": "",
                "street": "",
                "house number": 0,
                "state": ""
            }
        },
        "tenders": []

    };

var getDbUrl = function (url) {
    return got(url + '/dburl')
        .then(res => {
            return res.body;
        })
        .catch(err => {
            throw {
                status: 404,
                payload: {
                    message: "Could not retrieve database information."
                }
            };
        });
};

var checkUsernameUnique = function (username) {
    return got('http://' + config.get('user-exists-check-url.uri') + '/checkuserexsists/' + username)
        .then(res => {
            return res.body;
        })
        .catch(err => {
            throw {
                status: 404,
                payload: {
                    message: "Could not retrieve database information."
                }
            };
        });
};

var hashSha256 = function (text) {
    return got('http://' + config.get('hasher-url.uri') + '/hasher/sha256/' + text)
        .then(res => {
            return res.body;
        })
        .catch(err => {
            throw {
                status: 404,
                payload: {
                    message: "Could not retrieve hashed text."
                }
            };
        });
}

app.post('/reguser', function (req, res) {

    var dbToClose;

    checkUsernameUnique(req.body.username)
        .then(result => {
            var r = JSON.parse(result);
            if (r.status == 0) {
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.email = req.body.email;
                hashSha256(newUser.password)
                    .then(hashedPW => {
                        newUser.password = hashedPW.substr(1, hashedPW.length - 2);
                        getDbUrl('http://' + config.get('database-url.uri'))
                            .then(url => {
                                url = url.replace(/"/g, '');
                                mongoClient.connect(url)
                                    .then(db => {
                                        dbToClose = db;
                                        return db.collection('users');
                                    })
                                    .then(coll => {
                                        return coll.insertOne(newUser);
                                    })
                                    .then(insertResult => {
                                        var ir = JSON.parse(insertResult);
                                        dbToClose.close();

                                        if (ir.ok == 1) {
                                            res.status(200).json(ir);
                                        } else {
                                            res.status(400).json(ir);
                                        }
                                    })
                                    .catch(err => {
                                        res.status(400).json(err.payload.message);
                                    });
                            })
                            .catch(err => {
                                res.status(400).json(err.payload.message);
                            });
                    })
                    .catch(err => {
                        res.status(400).json(err.payload.message);
                    });
            } else {
                res.status(200)
                    .json({ message: "Username " + req.body.username + " is already taken." });
            }
        })
        .catch(err => {
            res.status(400).json(err.payload.message);
        });
});

app.listen(config.get('port'));