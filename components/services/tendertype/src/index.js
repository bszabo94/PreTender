const config = require('./config');

const express = require('express'),
    got = require('got'),
    mongoClient = require('mongodb'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());

app.get('/tendertype', function (req, res) {
    var query = { type: req.headers.type };
    var dataBase;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('tenderTypes').findOne(query);
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            dataBase.close();
            res.status(404)
                .json(err.message);
        });
});

app.get('/tendertype/:id', function (req, res) {
    var query = { _id: req.params.id };
    var dataBase;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('tenderTypes').findOne(query);
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            dataBase.close();
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));