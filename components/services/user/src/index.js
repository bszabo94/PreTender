const config = require('./config');

const express = require('express'),
    got = require('got'),
    mongoClient = require('mongodb'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());

app.get('/user/:username', function (req, res) {
    var query = { username: req.params.username };
    var dbToClose;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dbToClose = db;
            return db.collection('users').findOne(query);
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
        var dbToClose, query = req.body;
        mongoClient.connect(config.get('database.url'))
            .then(db => {
                dbToClose = db;
                var filterquery = { "username": req.params.username };
                return db.collection('users').updateOne(filterquery, query);
            })
            .then(result => {
                dbToClose.close();
                res.status(200).json(result);
            })
            .catch(err => {
                dbToClose.close();
                res.status(400).json(err.message);
            });
    };
});

app.listen(config.get('port'));