const config = require('./config');

const express = require('express'),
    got = require('got'),
    cors = require('cors'),
    mongoClient = require('mongodb'),
    oid = require('mongodb').ObjectId,
    app = express();

app.use(express.json());
app.use(cors());

var validate = function (pattern, data) {
    for (var key of Object.keys(pattern)) {
        if (pattern[key].required == 1 && (data[key] == undefined || data[key] == ""))
            return false;

        if (typeof data[key] != pattern[key].type.toLowerCase())
            return false;
    }
    return true;
};

app.get('/validateapplication/:id', function (req, res) {
    var query = { '_id': new oid(req.params.id) },
        application, tenderType, dataBase;
    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('applications').findOne(query);
        })
        .then(result => {
            application = result;
            var query = { _id: application.tendertype };
            return dataBase.collection('tenderTypes').findOne(query);
        })
        .then(result => {
            tenderType = result;
            return validate(tenderType.requirements, application.data);
        })
        .then(isValid => {
            dataBase.close();
            res.status(200)
                .json({ valid: isValid });
        })
        .catch(err => {
            dataBase.close();
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));