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

var validate = function (pattern, data) {
    for (var key of Object.keys(pattern)) {
        if (pattern[key].required == 1 && (data[key] == undefined || data[key] == ""))
            return false;

        if (typeof data[key] != pattern[key].type.toLowerCase())
            return false;
    }
    return true;
}

app.get('/validateapplication/:id', function (req, res) {
    var query = { '_id': new oid(req.params.id) },
        application, tenderType, dbToClose;
    getDbUrl('http://' + config.get('database-url.uri'))
        .then(url => {
            url = url.replace(/"/g, '');
            mongoClient.connect(url)
                .then(db => {
                    dbToClose = db;
                    return db.collection('applications').findOne(query);
                })
                .then(result => {
                    application = result;
                    var query = { _id: application.tendertype };
                    return dbToClose.collection('tenderTypes').findOne(query);
                })
                .then(result => {
                    tenderType = result;
                    return validate(tenderType.requirements, application.data);
                })
                .then(isValid => {
                    dbToClose.close();
                    res.status(200)
                        .json({ valid: isValid });
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