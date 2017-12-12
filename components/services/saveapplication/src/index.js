const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

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

app.post('/saveapplication', function (req, res) {
    if (JSON.stringify(req.body) == '{}') {
        res.status(400)
            .json("Nothing to save.");
    } else {
        getDbUrl('http://' + config.get('database-url.uri'))
            .then(url => {
                url = url.replace(/"/g, '');
                mongoClient.connect(url)
                    .then(db => {
                        dbToClose = db;
                        return db.collection('applications');
                    })
                    .then(coll => {
                        return coll.insertOne(req.body);
                    })
                    .then(reslt => {
                        dbToClose.close();
                        newres = {
                            insertedCount: reslt.insertedCount,
                            insertedId: reslt.insertedId
                        };
                        
                        res.status(200).json(newres);
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
    };
});

app.listen(config.get('port'));
