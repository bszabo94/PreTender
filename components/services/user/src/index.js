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

app.get('/user/:username', function (req, res) {
    var query = { username: req.params.username };
    var dbToClose;


    mongoClient.connect("mongodb://localhost:27017/pretender_database", function (err, db) {
        db.collection('users');
    });

    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            var user = null;
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
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json(err.message);
                });
        })
        .catch(err => {
            res.status(err.status)
                .json(err.payload);
        });
});

app.listen(config.get('port'));