const config = require('./config');

const express = require('express'),
    got = require('got'),
    cors = require('cors'),
    mongoClient = require('mongodb'),
    oid = require('mongodb').ObjectId,
    app = express();

app.use(express.json());
app.use(cors());

app.get('/application/:id', function (req, res) {
    var query = { '_id': new oid(req.params.id) }, dataBase;
    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('applications').findOne(query);
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            console.error(err);
            dataBase.close();
            res.status(404)
                .json(err.message);
        });
});

app.post('/application/:id', function (req, res) {
    var id = new oid(req.params.id);
    var filter = { '_id': id },
        query = req.body,
        dataBase;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('applications').updateOne(filter, query);
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            console.error(err);
            dataBase.close();
            res.status(400)
                .json(err.message);
        });
});

app.delete('/application/:id', function (req, res) {
    var id = new oid(req.params.id);
    var query = { '_id': id }, dataBase, user;

    mongoClient.connect(config.get('database.url'))
        .then(db => {
            dataBase = db;
            return db.collection('applications').findOne(query);
        })
        .then(result => {
            user = result.user;
            dataBase.collection('users').updateOne({ username: user }, { $pull: { tenders: id } });
            return dataBase.collection('applications').deleteOne(query);
        })
        .then(result => {
            dataBase.close();
            res.status(200)
                .json(result);
        })
        .catch(err => {
            dataBase.close();
            console.error(err);
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));