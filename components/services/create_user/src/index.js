const config = require('./config');

const express = require('express'),
    got = require('got'),
    mongoClient = require('mongodb'),
    cors = require('cors'),
    app = express();

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
    return got('http://' + config.get('user.url') + '/user/' + username)
        .then(res => {
            return JSON.parse(res.body) != null;
        })
        .catch(err => {
            throw err;
        });
};

var hashSha256 = function (text) {
    return got('http://' + config.get('hasher.url') + '/hasher/sha256/' + text)
        .then(res => {
            return res.body;
        })
        .catch(err => {
            throw err;
        });
}

app.post('/reguser', function (req, res) {
    var dataBase;

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
                                dataBase = db;
                                return db.collection('users').insertOne(newUser);
                            })
                            .then(insertResult => {
                                var ir = JSON.parse(insertResult);
                                dataBase.close();

                                if (ir.ok == 1) {
                                    res.status(200)
                                        .json(ir);
                                } else {
                                    res.status(404)
                                        .json(ir);
                                }
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
                    .json({ message: "Username " + req.body.username + " is already taken." });
            }
        })
        .catch(err => {
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));