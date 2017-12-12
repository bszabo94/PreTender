const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

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

    mongoClient.connect(config.get('database.url'))
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
                    mongoClient.connect(config.get('database.url'))
                        .then(db => {
                            dbToClose = db;
                            return db.collection('users');
                        })
                        .then(coll => {
                            var filterquery = { "username": req.params.username };
                            return coll.updateOne(filterquery, query);
                        })
                        .then(result => {
                            dbToClose.close();
                            res.status(200).json(result);
                        })
                        .catch(err => {
                            dbToClose.close();
                            res.status(400).json(err.message);
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
