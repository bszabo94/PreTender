const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');

var app = express();
app.use(express.json());

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

app.get('/user/:username', function (req, res) {
    var query = { username: req.params.username };
    var dbToClose;

    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('users');
                })
                .then(coll => {
                    return coll.findOne(query);
                })
                .then(result => {
                    dbToClose.close();
                    res.status(200).json(result);
                })
                .catch(err => {
                    dbToClose.close();
                    res.status(400).json(err.message);
                });
        })
        .catch(err => {
            res.status(err.status)
                .json(err.payload);
        });
});

app.post('/user/:username', function (req, res) {
    if (JSON.stringify(req.body) == '{}') {
        res.status(400)
            .json("Nothing to update.");
    } else {
        checkUserExists(req.params.username)
            .then(exists => {
                if (exists) {
                    var dbToClose, query = req.body;
                    getDbUrl('http://' + config.get('database-url.uri'))
                        .then(url => {
                            url = url.replace(/"/g, '');
                            mongoClient.connect(url)
                                .then(db => {
                                    dbToClose = db;
                                    return db.collection('users');
                                })
                                .then(coll => {
                                    return coll.updateOne({ "username": req.params.username }, { $set: query });
                                })
                                .then(result => {
                                    dbToClose.close();
                                    res.status(200).json(result);
                                })
                                .catch(err => {
                                    dbToClose.close();
                                    res.status(400).json(err.message);
                                });
                        })
                        .catch(err => {
                            throw {
                                status: 400,
                                payload: {
                                    message: "Something went wrong while saving " + req.params.username + " user."
                                }
                            };
                        });
                } else {
                    throw {
                        status: 400,
                        payload: {
                            message: "Something went wrong. Username " + req.params.username + " does not exists in the database."
                        }
                    };
                }
            })
            .catch(err => {
                res.status(400)
                    .json("Something went wrong while saving user.");
            });
    };
});

app.listen(config.get('port'));