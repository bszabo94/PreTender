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
    return got('http://' + config.get('user-unique-check-url.uri') + '/checkuserunique/' + username)
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

app.post('/reguser', function (req, res) {

    var dbToClose;

    checkUsernameUnique(req.body.username)
        .then(result => {
            var r = JSON.parse(result);
            if (r.status == 1) {
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.email = req.body.email;
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
                                res.status(400).json(err.message);
                            }
                            );
                    })
                    .catch(err => {
                        res.status(400).json(err.message);
                    });

            } else {
                res.status(200)
                    .json({ status: 0, message: r.message });
            }

        })
        .catch(err => {
            res.status(400).json(err.message);
        });


    // getDbUrl('http://' + config.get('database-url.uri'))
    //     .then(url => {
    //         url = url.replace(/"/g, '');
    //     })
    //     .catch(err => {
    //         res.status(err.status)
    //             .json(err.payload);
    //     });
});

app.listen(config.get('port'));