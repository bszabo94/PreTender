const config = require('./config');

const express = require('express');
const got = require('got');
var mongoClient = require('mongodb');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

app.get('/tendertype', function (req, res) {
    var query = { type: req.headers.type };
    var dbToClose;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dbToClose = db;
            return db.collection('tenderTypes');
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

app.get('/tendertype/:id', function (req, res) {
    var query = { _id: req.params.id };
    var dbToClose;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dbToClose = db;
            return db.collection('tenderTypes');
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

app.listen(config.get('port'));
