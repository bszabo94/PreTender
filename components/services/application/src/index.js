const config = require('./config');

const express = require('express');
const got = require('got');
var cors = require('cors');
var mongoClient = require('mongodb'),
    oid = require('mongodb').ObjectId;

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

app.get('/application/:id', function (req, res) {
    var query = { '_id': new oid(req.params.id) }, dbToClose;
    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('applications');
                })
                .then(coll => {
                    console.log(query);
                    return coll.findOne(query);
                })
                .then(result => {
                    dbToClose.close();
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    dbToClose.close();
                    res.status(400).json(err.message);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("Could not get application");
        });
});

app.post('/application/:id', function (req, res) {
    var id = new oid(req.params.id);
    var filter = { '_id': id },
        query = req.body,
        dbToClose;
    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('applications');
                })
                .then(coll => {
                    return coll.updateOne(filter, query);
                })
                .then(result => {
                    dbToClose.close();
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    dbToClose.close();
                    res.status(400).json(err.message);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("Could not get application");
        });
});

app.delete('/application/:id', function (req, res) {
    var id = new oid(req.params.id);
    var query = { '_id': id }, dbToClose, user;
    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('applications');
                })
                .then(coll => {
                    return coll.findOne(query);
                })
                .then(result => {
                    user = result.user;
                    dbToClose.collection('users').updateOne({ username: user }, { $pull: { tenders: id } });
                    return dbToClose.collection('applications').deleteOne(query);
                })
                .then(result => {
                    dbToClose.close();
                    res.status(200).json(result);
                })
                .catch(err => {
                    console.log(err);
                    dbToClose.close();
                    res.status(400).json(err.message);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("Could not get application");
        });
});

app.listen(config.get('port'));
