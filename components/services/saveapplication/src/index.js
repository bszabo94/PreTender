const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

app.post('/saveapplication', function (req, res) {
    if (JSON.stringify(req.body) == '{}') {
        res.status(400)
            .json("Nothing to save.");
    } else {
        mongoClient.connect(config.get('database.url'))
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
    };
});

app.listen(config.get('port'));
