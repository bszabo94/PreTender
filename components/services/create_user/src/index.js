const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

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

var checkUsernameUnique = function (username) {
    return got('http://' + config.get('user-url.uri') + '/user/' + username)
        .then(res => {
            if (JSON.parse(res.body) != null) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            throw {
                status: 404,
                payload: {
                    message: "Could not retrieve user information."
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
            console.log(err);
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
        .then(userExists => {
            if (!userExists) {
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.email = req.body.email;
                hashSha256(newUser.password)
                    .then(hashedPW => {
                        newUser.password = hashedPW.substr(1, hashedPW.length - 2);
                        mongoClient.connect(config.get('database.url'))
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