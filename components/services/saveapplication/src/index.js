const config = require('./config');

const express = require('express'),
    got = require('got'),
    mongoClient = require('mongodb'),
    cors = require('cors'),
    app = express();

app.use(express.json());
app.use(cors());

app.post('/saveapplication', function (req, res) {
    if (JSON.stringify(req.body) == '{}') {
        res.status(404)
            .json("Nothing to save.");
    } else {
        mongoClient.connect(config.get('database.url'))
            .then(db => {
                dataBase = db;
                return db.collection('applications');
            })
            .then(coll => {
                return coll.insertOne(req.body);
            })
            .then(reslt => {
                dataBase.close();
                newres = {
                    insertedCount: reslt.insertedCount,
                    insertedId: reslt.insertedId
                };

                res.status(200)
                    .json(newres);
            })
            .catch(err => {
                dataBase.close();
                res.status(404)
                    .json(err.message);
            });
    };
});

app.listen(config.get('port'));