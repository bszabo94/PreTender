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

app.get('/issuedtender/:id', function (req, res) {
    var query = { _id: parseInt(req.params.id) };
    console.log(query);
    var dbToClose;

    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('issuedTenders');
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

app.listen(config.get('port'));
